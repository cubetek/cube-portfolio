export const useEnv = () => {
    return computed(() => {
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
            return process.env.NODE_ENV;
        }
        return 'development'; // fallback
    });
}
