export const formatCPF = (cpf: string) => {
    if (!cpf || cpf.length < 3) return '';
    return cpf.slice(0, 3) + '.***.***-**';
};