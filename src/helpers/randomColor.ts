const randomColor = (): string => {
    // Definindo pelo menos 10 cores no formato hexadecimal 
    const cores = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
        '#33FFA1', '#FF8333', '#33A1FF', '#FF33FF', '#57FF33',
        '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD',
        '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'
      ];
      
    //Gerando um índice aleatório para selecionar uma cor 
    const randomIndex = Math.floor(Math.random() * cores.length);
    // Retornando a cor aleatória selecionada 
    return cores[randomIndex];
}

export default randomColor