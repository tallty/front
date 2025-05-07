import { message } from 'ant-design-vue';
import { Place, PlaceRule, WorkflowCoreTreeItem } from '../../../bpm-core/types';
import { cloneDeep, sortBy } from 'lodash-es';
/**
 * Node
 * id: number | null
 * seq: String (唯一编号)
 * type: 节点类型
 * next_nodes: Array (条件) (internal)
 * next_node: Object (子节点) (internal)
 * previous_node: 父节点 (internal)
 * route_node: 分支所在的路由节点 (internal)
 * kind: String (condition: 条件节点，close: 条件闭合节点) （internal)
 */

/* tslint:disable */
// node type 的必要成分
enum nodeTypes {
  START_NODE = 'Places::StartPlace',
  END_NODE = 'Places::EndPlace',
  ROUTE_NODE = 'Places::Route',
  CONCURRENT_NODE = 'Places::Concurrent',
  PLACE_NODE = 'Place',
}
enum nodeTransitionTypes {
  DEFAULT = 'Transitions::AndApproval',
  ROUTE_NODE = 'Transitions::OrApproval',
}
export const KIND_CONDITION = 'condition';

interface IArgs {
  nodes: Place[];
  associations: WorkflowCoreTreeItem[];
  maxStack?: number;
}

export default class Transformer {
  internalAttributes: any[] = [];
  maxStack = 200;
  associations: any[] = [];
  nodes: any[] = [];
  rootNode: Partial<Place> = {};
  treeNode: Partial<Place> = {};
  endNode: Partial<Place> = {};
  newNode: Partial<Place> = {};
  seed = 0;
  vm: any = null;

  // seq -> node
  nodesMap: Record<string, Place> = {};
  // seq -> target nodes
  nextNodesMap: Record<string, Place[]> = {};
  // seq -> source nodes
  sourceNodesMap: Record<string, Place[]> = {};
  // seq ary
  renderedNodeCache: string[] = [];

  constructor(args: IArgs) {
    const { nodes, associations, maxStack } = args;
    this.internalAttributes = [
      'next_node',
      'next_nodes',
      'previous_node',
      'route_node',
      'kind',
      'index',
    ];
    this.maxStack = maxStack || 200;

    this.associations = associations.filter((o: any) => o.source.seq !== o.target.seq);
    this.nodes = nodes;
    this.rootNode = {};
    this.treeNode = {};
    this.endNode = {};

    this.newNode = {}; // 当添加节点时，设置新节点未 newNode

    this.seed = new Date().getTime();
    this.vm = this;

    if (nodes.length >= 2 && associations.length >= 1) {
      this.reload();
    } else {
      throw new Error('There must be at least two nodes and one edge.');
    }
  }

  // 数据脱敏处理
  get core() {
    const places = this.nodes.map(o => {
      const cloneObj = {
        ...o,
      };
      this.internalAttributes.forEach(key => {
        delete cloneObj[key];
      });
      return cloneObj;
    });
    return {
      places: Array.from(places),
      tree: Array.from(this.associations),
    };
  }

  reload() {
    // seq -> node，This is the infrastructure of this module.
    this.nodesMap = this.nodes.reduce((obj, node) => {
      obj[node.seq] = node;
      return obj;
    }, {});
    // seq -> target nodes
    this.nextNodesMap = this.associations.reduce((map, item) => {
      map[item.source.seq] = (map[item.source.seq] || []).concat(this.nodesMap[item.target.seq]);
      return map;
    }, {});
    // seq -> source nodes
    this.sourceNodesMap = this.associations.reduce((map, item) => {
      map[item.target.seq] = (map[item.target.seq] || []).concat(this.nodesMap[item.source.seq]);
      return map;
    }, {});
    this.rootNode = this.nodes.find(o => !this.sourceNodesMap[o.seq]);
    this.endNode = this.nodes.find(o => !this.nextNodesMap[o.seq]);
    this.renderedNodeCache = [];
  }

  /*
   * Main
   * 由节点和关系 生成 嵌套的树形结构
   */
  renderTree(vm = this.vm) {
    this.vm = vm;
    this.treeNode = {
      ...this.rootNode,
    };
    let count = 0;

    const renderNode = (node: any, end: any) => {
      if (!node) return;
      if (count > this.maxStack) return;
      if (node.type === nodeTypes.PLACE_NODE && this.renderedNodeCache.includes(node.seq)) return;
      count += 1;

      const nextNodes = this.nextNodesMap[node.seq] || [];
      const nextOrCrossNode = this.getNextOrCrossNode(node);

      // 更新 newNode
      if (node.seq === this.newNode.seq) {
        this.newNode = node;
      }

      if (node.type === nodeTypes.ROUTE_NODE) {
        // 1.【递归主要逻辑】渲染闭合节点
        if (this.renderedNodeCache.includes(nextOrCrossNode.seq!)) {
          vm.$set(node, 'next_node', null);
          this.renderedNodeCache.push(node.seq);
        } else {
          vm.$set(nextOrCrossNode, 'previous_node', node);
          vm.$set(node, 'next_node', nextOrCrossNode);
          this.renderedNodeCache.push(node.seq);
          renderNode(node.next_node, end);
        }
        // 2. 渲染分支
        const conditionNodes = this.getConditionNodes(node, nextNodes, nextOrCrossNode);
        vm.$set(node, 'next_nodes', conditionNodes);
        nextNodes.forEach((nd: any) => {
          if (nd.seq !== nextOrCrossNode.seq) {
            renderNode(nd, nextOrCrossNode);
          }
        });
      } else if (nextNodes.length > 1) {
        // 一对多, 并发节点
      } else if (nextNodes.length === 1) {
        // 一对一，【递归主要逻辑】添加关联节点
        const nextNode = nextNodes[0];
        // Update the previous node of next node.
        vm.$set(nextNode, 'previous_node', node);
        vm.$set(nextNode, 'route_node', node.route_node);
        if (this.renderedNodeCache.includes(nextNode.seq)) {
          vm.$set(node, 'next_node', null);
          this.renderedNodeCache.push(node.seq);
        } else {
          vm.$set(node, 'next_node', nextNode);
          this.renderedNodeCache.push(node.seq);
          renderNode(node.next_node, end);
        }
      } else {
        // 无目标节点
        vm.$set(node, 'next_node', null);
        this.renderedNodeCache.push(node.seq);
      }
    };
    renderNode(this.treeNode, this.endNode);
    return this.treeNode;
  }

  /*
   * Main
   * 由 Node 节点结构出【结点关系】和【节点】
   */
  deconstructNode(node = this.treeNode) {
    this.nodes = [];

    this.associations = [];
    this.saveNodeAndAssociation(node);
    this.reload();
    return this;
  }

  // 保存节点以及节点与子节点的关系
  saveNodeAndAssociation(node: any) {
    // 1. Save node
    // 条件节点是历史加的虚拟节点，需要合并成 route 节点后保存
    if (node.kind !== KIND_CONDITION) {
      this.nodes.push(node);
    }
    // 2. Add associations
    // 结束节点没有后续关系，route 节点不参与关系，使用 condition 节点代理 route
    if (node.type !== nodeTypes.ROUTE_NODE && !node.type.includes(nodeTypes.END_NODE)) {
      const nextNode = Transformer.findNextAssociateNode(node);
      this.associations.push({
        source: {
          id: node.id || null,
          seq: node.seq,
        },
        target: {
          id: nextNode.id,
          seq: nextNode.seq,
        },
      });
      // 更新 condition
      if (node.kind === KIND_CONDITION) {
        node.condition.target.seq = nextNode.seq;
        node.condition.target.id = nextNode.id;
      }
    }
    // 3. Recursion invoke
    // Route node
    if (node.next_nodes) {
      // 更新 route 的条件
      node.options.rules = sortBy(
        node.next_nodes.map((o: any) => ({
          ...o.condition,
        })),
        (o: any) => o.index,
      );

      node.next_nodes.forEach((nd: any) => {
        this.saveNodeAndAssociation(nd);
      });
    }
    // node
    if (node.next_node) {
      this.saveNodeAndAssociation(node.next_node);
    }
  }

  // 找到节点下一个关系节点，用于创建 association
  static findNextAssociateNode(node: any) {
    if (node.next_node) {
      return node.next_node;
    }
    if (node.route_node) {
      let routeNode = node.route_node;
      while (routeNode && !routeNode.next_node) {
        routeNode = routeNode.route_node;
      }
      return routeNode && routeNode.next_node;
    }
    return null;
  }

  // 更近原始数据，获取分支相交的闭合节点
  getNextOrCrossNode(node: any) {
    const nextNodes = this.nextNodesMap[node.seq] || [];
    if (nextNodes.length === 1) {
      // 1. 只有一个子节点，直接返回
      return Object.assign(nextNodes[0], {
        route_node: node.route_node,
      });
    }
    if (nextNodes.length > 1) {
      // 2. 有多个子节点，找到最近的相同子节点，作为闭合节点
      const paths: any[] = [];
      nextNodes.forEach((nd: any) => paths.push(this.getNodeBranchPath(nd)));
      const crossNodeSeq = Transformer.findBranchesCrossNode(paths);
      return crossNodeSeq
        ? {
            ...this.nodesMap[crossNodeSeq],
            previous_node: node,
            route_node: node.route_node,
          }
        : this.endNode;
    }
    return this.endNode;
  }

  // 获取节点后续的第一条子节点路径
  getNodeBranchPath(node: any) {
    const seq = node.kind === KIND_CONDITION ? node.next_node.seq : node.seq;
    const path = [seq];
    let next = this.nextNodesMap[seq];
    while (next) {
      const firstNodeSeq = next[0] && next[0].seq;
      const nextSeq = this.nextNodesMap[firstNodeSeq] && this.nextNodesMap[firstNodeSeq][0].seq;

      if (firstNodeSeq === seq || nextSeq === firstNodeSeq) {
        next = [];
      } else {
        path.push(firstNodeSeq);
        next = this.nextNodesMap[firstNodeSeq];
      }
    }
    return path;
  }

  // 根据路径，找到路径的最近相同点
  static findBranchesCrossNode(paths: any[] = []) {
    const countMap = Object.create(null);
    paths
      .reduce((a, o) => a.concat(o))
      .forEach((seq: any) => {
        countMap[seq] = countMap[seq] ? countMap[seq] + 1 : 1;
      });
    return paths[0].find((seq: any) => countMap[seq] === paths.length);
  }

  // * 将 route 节点按照条件，代理成条件节点，route 节点不需要显示
  getConditionNodes(routeNode: any, nextNodes: any, nextOrCrossNode: any) {
    return (routeNode.options?.rules || []).map((rule: any) => {
      const { target } = rule;

      // 判断分支上，是否只剩条件节点
      const conditionNextNode =
        nextOrCrossNode.seq === target.seq
          ? null
          : this.nextNodesMap[routeNode.seq].find((nd: any) => nd.seq === target.seq);

      // 去除无用的 rules
      // rules = rules.filter((c: any) => c.key && c.key_name);

      const conditionNode = {
        id: routeNode.id,
        seq: routeNode.seq, // We regard route node seq as condition node seq
        type: nodeTypes.PLACE_NODE,
        kind: KIND_CONDITION,
        route_node: routeNode,
        previous_node: routeNode,
        next_node: conditionNextNode,
        condition: rule,
      };
      if (conditionNextNode && nextOrCrossNode.seq !== target.seq) {
        conditionNextNode.previous_node = conditionNode as any; // TODO: type error
        conditionNextNode.route_node = routeNode;
      }
      return conditionNode;
    });
  }

  // 模拟 vue 的 $set 方法
  $set(target: any, key: any, value: any) {
    target[key] = value;
    return this;
  }

  // get a unique seq
  getNewSeq() {
    this.seed += 1;
    return `p.${this.seed}`;
  }

  // ================== node operations ==================
  removeNode(removeNode: any) {
    // 删除条件节点，删除整个分支
    const removeAssociation = (node: any) => {
      if (node.kind === KIND_CONDITION) {
        const index = node.previous_node.options.rules.indexOf(node.condition);
        if (node.route_node.next_nodes.length > 2) {
          node.previous_node.next_nodes.splice(index, 1);
          node.previous_node.options.rules.splice(index, 1);
        } else {
          // 当只有两个条件时，删除路由节点，移动剩余条件节点饿子节点
          const onlyConditionNode = removeNode.previous_node.next_nodes[0];
          if (onlyConditionNode.next_node) {
            node.previous_node.next_nodes.splice(index, 1);
            node.previous_node.options.rules.splice(index, 1);
            // 先删除第一个条件，然后更新树，再删除另一个条件
            this.deconstructNode(this.treeNode);
            this.renderTree();
            this.removeNode(onlyConditionNode);
          } else {
            // 移除路由节点
            removeAssociation(node.previous_node);
          }
        }
      } else if (node.next_node) {
        // 删除中间节点
        node.previous_node.next_node = node.next_node;
        node.next_node.previous_node = node.previous_node;
      } else {
        // 删除尾节点
        node.previous_node.next_node = null;
      }
    };

    removeAssociation(removeNode);
    this.deconstructNode(this.treeNode);
    this.renderTree();
    return this;
  }

  addNode(node: any, extra: any) {
    const selfExtra = extra || {
      transition_type: nodeTransitionTypes.DEFAULT,
    };

    this.newNode = {
      id: null,
      type: nodeTypes.PLACE_NODE,
      seq: this.getNewSeq(),
      fields: {},
      options: {},
      ...selfExtra,
    };

    Transformer.selfInsertNode(node, this.newNode);
    this.deconstructNode();
    this.renderTree();
    return this;
  }

  addRoute(node: any, extra?: any) {
    Transformer.selfInsertNode(node, {
      id: null,
      type: nodeTypes.ROUTE_NODE,
      seq: this.getNewSeq(),
      transition_type: nodeTransitionTypes.ROUTE_NODE,
      fields: {
        fields: [],
      },
      next_nodes: [],
      options: {
        rules: [],
      },
      ...extra,
    });
    this.selfInsertCondition(node.next_node);
    this.selfInsertCondition(node.next_node, { is_default: true });
    this.deconstructNode();
    this.renderTree();
    return this;
  }

  addCondition(node: any) {
    this.selfInsertCondition(node);
    this.deconstructNode();
    this.renderTree();
    return this;
  }

  static selfInsertNode(node: Partial<Place>, newNode: Partial<Place>) {
    const insert = {
      ...newNode,
      route_node: node.route_node,
    };
    if (node.next_node) {
      // 一、插入节点之间
      insert.next_node = node.next_node;
      node.next_node.previous_node = insert;
      insert.previous_node = node;
      node.next_node = insert;
    } else {
      // 二、插入尾节点
      node.next_node = insert;
      insert.previous_node = node;
    }
  }

  selfInsertCondition(routeNode: any, defaultCondition: PlaceRule = {}) {
    const nextNode = Transformer.findNextAssociateNode(routeNode);
    const condition = {
      index: routeNode.options.rules.length,
      target: {
        id: null,
        seq: nextNode && nextNode.seq,
      },
      ...defaultCondition,
    };

    routeNode.next_nodes = routeNode.next_nodes || [];
    this.vm.$set(
      routeNode,
      'options',
      routeNode.options || {
        rules: [],
      },
    );
    routeNode.options.rules.push(condition);

    routeNode.next_nodes.push({
      id: routeNode.id,
      seq: routeNode.seq, // We regard route node seq as condition node seq
      type: nodeTypes.PLACE_NODE,
      kind: KIND_CONDITION,
      route_node: routeNode,
      previous_node: routeNode,
      next_node: null,
      condition,
    });
  }

  topConditionNode(conditionNode: any) {
    const routeNode = this.nodesMap[conditionNode.route_node!.seq];
    const conditionIndex = conditionNode.condition.index;
    const rules = sortBy(routeNode.options?.rules || [], (rule: any) => rule.index);

    if (conditionIndex < 0) {
      message.error('条件节点错误');
      return this;
    }

    rules.forEach((n: any, index: number) => {
      if (index < conditionIndex) {
        n.index += 1;
      } else if (index === conditionIndex) {
        n.index = 0;
      }
    });

    rules.unshift(rules.splice(conditionIndex, 1)[0]);

    routeNode.options.rules = rules;
    this.deconstructNode();
    this.renderTree();

    return this;
  }

  // ===============  ===============
  static cloneNode(node: any) {
    const copyNode = { ...node };
    ['next_node', 'next_nodes', 'previous_node', 'route_node'].forEach((key: string) => {
      delete copyNode[key];
    });
    return JSON.parse(JSON.stringify(copyNode));
  }
}
