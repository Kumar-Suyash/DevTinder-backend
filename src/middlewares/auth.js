
const adminAuth = (req, res, next) =>{

      //* logic for checking if the request is autheriozed or not

    const token = "xyz";
    const isAdminAutheriozed = token === "xyz";
    if(isAdminAutheriozed){
        next();
    } else {
        res.status(401).send("Unautherized request");
    }
};

const userAuth = (req, res, next) =>{

      //* logic for checking if the request is autheriozed or not

    const token = "xyz";
    const isAdminAutheriozed = token === "xyz";
    if(isAdminAutheriozed){
        next();
    } else {
        res.status(401).send("Unautherized request");
    }
};

module.exports = {
adminAuth,
userAuth,
};