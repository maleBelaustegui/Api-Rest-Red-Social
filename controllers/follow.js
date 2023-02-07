//test
const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/follow.js"
    });
}


//export

module.exports = {
    pruebaFollow
}