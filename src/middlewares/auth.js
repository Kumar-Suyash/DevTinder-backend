// const uri1 = `mongodb+srv://ksuyash001_db_user:2NQDMSKKaRWEnJtb@cluster1.5pernik.mongodb.net/`
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