//test
const pruebaPublication = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/publication.js"
    });
}


//export

module.exports = {
    pruebaPublication
}