import Cookies from 'js-cookie';

const user = {
    state: {},
    mutations: {
        logout (state, vm) {
            // 清除缓存
            Cookies.remove('user');
            Cookies.remove('password');
            localStorage.clear();
        }
    }
};

export default user;
