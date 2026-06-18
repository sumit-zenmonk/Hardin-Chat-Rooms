export const randomImageUrl = () => {
    const num1 = Number(Math.random() * 1000).toFixed(0);
    const num2 = Number(Math.random() * 1000).toFixed(0);

    const randomImageUrl = `url("https://picsum.photos/${num1}/${num2}?blur=2")`;

    return randomImageUrl;
}