const logger = "../../logger.js"

function redirectList(req, res, next) {
    res.redirect(303, "/todo/list")
    next();
}

function listWebPage(req, res, next) {
    const data = req.session.data;
    res.render("todo/list.hbs", {data});
}

function addNewItem(req, res, next) {
    if (!req.session.data) {
        req.session.data = {};
        req.session.count = 0;
        req.session.data.item0 = {};
        req.session.data.item0.message = req.body.item;
    } else {    
        req.session.count++;
        let count = req.session.count;
        let item = `item${count}`;
        req.session.data[item] = {};
        req.session.data[item].message = req.body.item;
    }
    
    res.redirect(303, "/todo/list")
}

function saveMarkedItem(req, res, next) {
    for (let index = 0; index <= req.session.count; index++) {
        let item = `item${index}`;
        
        console.log(req.body[item])

        if(req.body[item] == "done") {
            req.session.data[item].done = "checked"
        }
        else{
            req.session.data[item].done="";
        }
    }
    res.redirect(303, "/todo/list")
}

function removeCompletedItems(req, res, next) {
    for (let index = 0; index <= req.session.count; index++) {
        let item = `item${index}`;
        if(req.body[item] || req.session.data[item].done == "checked") {
            delete req.session.data[item]; 
            --req.session.count; 
        }
    }
    res.redirect(303, "/todo/list");
}

module.exports = {
    redirectList,
    listWebPage,
    addNewItem,
    saveMarkedItem,
    removeCompletedItems
}