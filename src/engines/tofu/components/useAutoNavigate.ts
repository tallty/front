import { useRouter } from 'vue-router';
import { state, useAutoMenuHelper } from './useAutoMenu';
import { ref } from 'vue';
import useAutoMenu from './useAutoMenu';

const useAutoNavigate = () => {
  const router = useRouter();
  const loading = ref(false);

  const { fetchMenuTree } = useAutoMenu();
  const { getDeepest } = useAutoMenuHelper();

  const tofuAutoNavigate = () => {
    loading.value = true;
    fetchMenuTree().then(() => {
      loading.value = false;
      router.push(getDeepest(state.menuTree[0])?.url || '/');
    });
  };

  return {
    loading,
    tofuAutoNavigate,
  };
};

export default useAutoNavigate;
