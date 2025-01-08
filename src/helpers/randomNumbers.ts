const randomNumber = (): number => {
    const numeros = [3, 5, 7, 9];
    const randomIndex = Math.floor(Math.random() * numeros.length);
    return numeros[randomIndex];
}

export default randomNumber