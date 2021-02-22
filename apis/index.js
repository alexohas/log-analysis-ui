
export const searchFunction = async function (args) {
    return fetch('https://cryptic-spire-82768.herokuapp.com/'+args)
        .then(response => response.json())
        .then(data => data);
}