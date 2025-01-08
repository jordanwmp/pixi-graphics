import Russian1 from '../../dist/images/russian_1.jpg';
import Russian2 from '../../dist/images/russian_2.jpg';
import Russian3 from '../../dist/images/russian_3.jpg';
import Russian4 from '../../dist/images/russian_4.jpg';
import Putin from '../../dist/images/putin.jpg';

const getImage  = () =>{
    //Russian1, Russian2, Russian3, 
    const images = [Russian4, Putin]
    // Gerando um índice aleatório para selecionar uma imagem 
    const randomIndex = Math.floor(Math.random() * images.length); 
    // Retornando a imagem aleatória selecionada 
    return images[randomIndex];
}

export default getImage