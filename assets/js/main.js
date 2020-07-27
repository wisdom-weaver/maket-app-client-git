var rawdata;

var currentcategory = '';
var currentsubcategory = '';
var currenttimegame = '';

//https://spreadsheets.google.com/feeds/list/1GUKmbcDfOsQPsUTe1n4KmjFJvpes5Abs1y0_a6DDsRg/1/public/values?alt=json
//https://spreadsheets.google.com/feeds/list/1QmMWt2Vv5cyrGoTAl7uUhOC78q0c1e6B89Ay0jJCOEE/1/public/values?alt=json
//https://spreadsheets.google.com/feeds/list/1i9lVgv4yhWqfSDqlLxb5NZc7ldTz5nyQJbxFO-XljEQ/1/public/values?alt=json
//$.get('').then(json=>{console.log(json.feed.entry)})
var categories={} ;

var modalelement , modalinstance ;

var checkedlist =[
    //{ id, category, subcategory, game, team, description, odds }
];

var minimumSelections = 2;
var maximumSelections = 5;

var createparlaybtnenabled = true;
var cartview = false;
var cartNotOpenYet = true;
function createid(){

}

function handlesheet2(){
    console.log('handle2');
    var starttime = getTime();
    $.get('https://spreadsheets.google.com/feeds/list/1GUKmbcDfOsQPsUTe1n4KmjFJvpes5Abs1y0_a6DDsRg/1/public/values?alt=json').then(json=>{
        console.log(json.feed.entry.length);
        rawdata = json.feed.entry;
        return $.get('https://spreadsheets.google.com/feeds/list/1QmMWt2Vv5cyrGoTAl7uUhOC78q0c1e6B89Ay0jJCOEE/1/public/values?alt=json');
    }).then(json2=>{
        console.log(json2.feed.entry.length);
        rawdata = rawdata.concat(json2.feed.entry);
        return $.get('https://spreadsheets.google.com/feeds/list/1i9lVgv4yhWqfSDqlLxb5NZc7ldTz5nyQJbxFO-XljEQ/1/public/values?alt=json');
    }).then(json3=>{
        console.log(json3.feed.entry.length);
        rawdata = rawdata.concat(json3.feed.entry);
        var endtime = getTime();
        console.log('fetched in ', endtime - starttime);
    }).catch(err=>{console.log(err);})
}

function handlesheet(){
    console.log('handlesheet');
    var starttime = getTime();
    $.get('https://spreadsheets.google.com/feeds/list/1GUKmbcDfOsQPsUTe1n4KmjFJvpes5Abs1y0_a6DDsRg/1/public/values?alt=json').then(json=>{
        //console.log('fetched sheet1',json.feed.entry.length);
        rawdata = json.feed.entry;
        return $.get('https://spreadsheets.google.com/feeds/list/1QmMWt2Vv5cyrGoTAl7uUhOC78q0c1e6B89Ay0jJCOEE/1/public/values?alt=json');
    }).then(json2=>{
        //console.log('fetched sheet2',json2.feed.entry.length);
        rawdata = rawdata.concat(json2.feed.entry);
        return $.get('https://spreadsheets.google.com/feeds/list/1i9lVgv4yhWqfSDqlLxb5NZc7ldTz5nyQJbxFO-XljEQ/1/public/values?alt=json');
    }).then(json3=>{
        //console.log('fetched sheet3',json3.feed.entry.length);
        rawdata = rawdata.concat(json3.feed.entry);
        var endtime = getTime();
        console.log('fetched in ', endtime - starttime);
    }).then(()=>{
        //console.log(rawdata);
        var renderstarttime = getTime();
        categories.data = [] ;
        rawdata.forEach(row=>{
            var category = row.gsx$category.$t;
            var subcategory = row.gsx$subcategory.$t;
            var time = row.gsx$time.$t;
            var game = row.gsx$game.$t;
            var mid = row.gsx$bet250.$t;
            var timegame= time+": "+game;
            var description = row.gsx$description.$t;
            var teama = row.gsx$teama.$t;
            var aodds = row.gsx$aodds.$t;
            var teamb = row.gsx$teamb.$t;
            var bodds = row.gsx$bodds.$t;

            if(!categories.data.includes(category)){
                categories.data.push(category);
                categories[category]={
                    category,
                    data: [  ]
                }
                
            };
           
            if(!categories[category].data.includes(subcategory)){ 
                categories[category].data.push(subcategory);
                categories[category][subcategory] = {
                    category, subcategory,
                    data: [ ]
                }
            }

            if(!categories[category][subcategory].data.includes(timegame)){ 
                categories[category][subcategory].data.push(timegame);
                categories[category][subcategory][timegame] ={
                    category, subcategory, timegame, time ,game,
                    data: []
                }
            }

            if(!categories[category][subcategory][timegame].data.includes({category, subcategory, timegame, description, teama, teamb, aodds, bodds, mid })){ 
                categories[category][subcategory][timegame].data.push({category, subcategory, timegame, description, teama, teamb, aodds, bodds, mid });
            }
            

        });
        var renderendtime = getTime();
        //console.log('categories',categories, renderendtime-renderstarttime);
        console.log('rendered', renderendtime- renderstarttime);

    }).then(()=>{
        //installCategoryTabs();
        restoreview();
        restorecart();
    }).then(()=>{
        setTimeout(handlesheet,2000);
    }).catch((err)=>{
        console.log(err);        
    });
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function installCategoryTabs(){
    //console.log('installing categoriestab', currentcategory, currentsubcategory, currenttimegame);
    var html = "";
    categories.data.forEach(tab => {
        html+=`<div onclick="SelectCategory('${tab}')" class="tab-container center"><div class="btn btn-small tab">${tab}</div></div>`;
        
    });
    $('.tabs-container').html(html);
    configureFrontEnd();
}

function SelectCategory(cat){
    currentcategory = cat;
    currentsubcategory = currenttimegame = '';
    installSubcategoryTabs();
    configureFrontEnd();
    //current();
    $('.heading-container h6').html(`${currentcategory}`);
    setBackground(cat.trim().toLowerCase());
}

function installSubcategoryTabs(){
    try{
        var html =""
        categories[currentcategory].data.forEach(subcategory=>{
            html+=`<div onclick="SelectSubCategory('${subcategory}')" class="tab-container center"><div class="btn btn-small tab">${subcategory}</div></div>`;
        });
        $('.tabs-container').html(html);
        configureFrontEnd();
    }catch(err){reset();}
} 

function SelectSubCategory(subcat){
    try{
        currentsubcategory = subcat;
        currenttimegame = '';
        installSubcategoryTabs();
        var html=`<div class="match-bg-cont">`;
        categories[currentcategory][currentsubcategory].data.forEach(listelem=>{
            html += `<div onclick="SelectGame('${listelem}')" class="match-container"><div class="match">${listelem}</div></div></br>`;
        });
        html+=`</div>`;
        $('.matchs-container').html(html);
        $('.heading-container h6').html(`${currentcategory} > ${currentsubcategory}`);
    }catch(err){reset();}
    //current();
}

function SelectGame(game){
    try{
        installSubcategoryTabs();
        currenttimegame = game;
        var html= `
        <div class="match-bg-cont">
        <table class="tabledata">
        <tr>
            <th>Description</th>
            <th>Team A</th>
            <th>A Odds</th>
            <th>Team B</th>
            <th>B Odds</th>
            <th>BET>$250</th>
        </tr>
        `;

        categories[currentcategory][currentsubcategory][currenttimegame].data.forEach((row,index)=>{
            html+=`
            <tr>
                <td>${row.description}</td>
                <td>${row.teama}</td>
                <td>
                    <span onclick="handlecheck('a${row.mid}')" >
                        <input name="a${row.mid}" id="a${row.mid}" type="radio" />
                        <span>${row.aodds}</span>
                    </span>
                </td>
                <td>${row.teamb}</td>
                <td>
                    <span onclick="handlecheck('b${row.mid}')" >
                        <input name="b${row.mid}" id="b${row.mid}" type="radio" />
                        <span>${row.bodds}</span>
                    </span>
                </td>
                <td><a href="https://fairlay.com/market/${row.mid}" target="_blank" class="accent-link">${row.mid}</a></td>
            </tr>`;
        })
        html+="</table></div>";
        $('.matchs-container').html(html);
        $('.heading-container h6').html(`${currentcategory} > ${currenttimegame}`);
        $('input[type="radio"]').prop('checked',false);
        checkallselected();
    }catch(err){
        reset();
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function configureFrontEnd(){
    var calheight = $(window).height()- $('.data-block').height() +$('.matchs-container').height() - 5;
    $('.matchs-container').height(calheight);
}

function setBackground(img){
    $('.matchs-container').css('background-image'    , `url('./assets/img/${img}.jpg')`);
    $('.matchs-container').css('background-position' , `center`);
    $('.matchs-container').css('background-size'     , `contain`);
    $('.matchs-container').css('background-repeat'   , `no-repeat`);
    $('.matchs-container').css('background-color'    , `black`);
}

function reset(){
    currentcategory = currentsubcategory = currentmatch = '';
    installCategoryTabs();
    $('.matchs-container').html('');
    $('.heading-container h6').html('Fairlay App');
    configureFrontEnd();
    setBackground('bg2');
}

function current(){
    console.log('current',currentcategory,currentsubcategory, currenttimegame);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        
var elems ;
var instances ;

function uncheckall(){
    $('input[type="radio"]').prop('checked',false);
}

function checkallselected(){
    checkedlist.forEach(each=>{
        $(`#${each.uid}`).prop('checked',true);;
    })
}

function getuidIndexinCheckedlist(uid){
    return checkedlist.findIndex((elem,index)=>{
        if(elem.uid == uid){
            return true;
        }
    });
}
function getuidObjinCheckedlist(uid){
    return checkedlist.find((elem,index)=>{
        if(elem.uid == uid){
            return true;
        }
    });
}



function removeselection(uid){
    var uidindex = getuidIndexinCheckedlist(uid);
    endtimer(uid);
    checkedlist.splice(uidindex,1);
    $(`#${uid}`).prop('checked',false);
    showmodal();
    checkForSameGameSelections();
    showmodal();
}

function getcheckobj(uid){
    var tid = uid.charAt('a');
    var mid = uid.slice(1);
    var current = rawdata.find((row,index)=>{
        if(row.gsx$bet250.$t == mid){
            return true;
        }
    });
    var checkobj={
        uid: uid,
        mid: current.gsx$bet250.$t,
        category: current.gsx$category.$t,
        subcategory: current.gsx$subcategory.$t,
        time: current.gsx$time.$t,
        game: current.gsx$game.$t,
        timegame: current.gsx$time.$t+current.gsx$game.$t,
        description: current.gsx$description.$t,
        team: (tid == 'a')? current.gsx$teama.$t : current.gsx$teamb.$t ,
        odds: (tid == 'a')? current.gsx$aodds.$t : current.gsx$bodds.$t,
        tid: tid,
        highlight: false,
        state:1,
        intervalfunc:'',
        rand:0
    }
    return checkobj;
}

function handlecheck(uid){
    //console.log(uid);
    var mid =uid.slice(1);
    var complementuid = ((uid.charAt(0) == 'a')? 'b' : 'a' )+uid.slice(1);
    var uidindex = getuidIndexinCheckedlist(uid);
    var complementuidindex = getuidIndexinCheckedlist(complementuid);
    
    //console.log('uid',uid,uidindex, '|', 'complementuid',complementuid, complementuidindex);
    if(complementuidindex>-1){
        checkedlist.splice(complementuidindex,1);
        $(`#${complementuid}`).prop('checked',false);
    }
        if(uidindex > -1){
            //already exists 
            if(!getuidObjinCheckedlist(uid).createdbet){
                //bet is not made on this
                checkedlist.splice(uidindex,1);
                $(`#${uid}`).prop('checked',false);
            }else{
                //bet has been alredy made on this
                alert('bet has been already made');
            }
            
        }else{
            //new entry
            if(checkedlist.length < maximumSelections){
                //entry is less than limit
                checkedlist.push(getcheckobj(uid));
                $(`#${uid}`).prop('checked',true);
                handlecreateparlaystate();
                showmodal();
            }else{
                //entry is exceeding limit
                alert('Maximum limit to make selections is 5 only.');
                showmodal();
            }
            
        }
    //console.log(checkedlist);
}

function showmodal(){
    var modalhtml =`
    <div class="modal-content">
        <div class="btn-container center"><div id="createparlay2" onclick="handlecreateparlay()" class="btn btn-small banner-button blue `+( createparlaybtnenabled?``:`disabled` )+` ">Create Parlay</div></div>
        <p class="white-text">
            <table class="tabledata-modal">
    `

    if(checkedlist.length>0){
        checkedlist.forEach(row=>{
            modalhtml+=`
            <tr class="${row.uid}row `+ (row.highlight?`highlightrow`:``) +`" >
                <td>${row.timegame}</td>
                <td>${row.description}</td>
                <td>${row.team}</td>
                <td>${row.odds}</td>
                <td><a href="https://fairlay.com/market/${row.mid}" target="_blank" class="accent-link">${row.mid}</a></td>
                `
                +
                (
                    (row.state == 1)
                    ?`  <td><a href="#!" onclick="createBet('${row.uid}')" class="waves-effect waves-green btn btn-small accent-color-button">Create Bet!</a></td>
                        <td><a class="btn-floating btn-small waves-effect waves-light red" onclick=removeselection('${row.uid}')><i class="material-icons">close</i></a></td>`
                    :``
                )
                +
                (
                    (row.state == 2)
                    ?`  <td><span class="yellow-text">Creating Bet...</span></td>
                        <td><a class="btn-floating btn-small waves-effect waves-light red" onclick=removeselection('${row.uid}')><i class="material-icons">close</i></a></td>`
                    :``
                )
                +
                (
                    (row.state == 3)
                    ?`  <td><p class="center timer accent-color-text">&nbsp;&nbsp;:&nbsp;&nbsp;</p><a href="#!" onclick="placeBet('${row.uid}')" class="waves-effect waves-green btn btn-small bet-button blue">Place Bet</a></td>
                        <td><a class="btn-floating btn-small waves-effect waves-light red" onclick=removeselection('${row.uid}')><i class="material-icons">close</i></a></td>`
                    :``
                )
                +(
                    (row.state == 4)
                    ?`  <td><span class="blue-text">Placing Bet....</span></td>
                        <td><a class="btn-floating btn-small waves-effect waves-light red" onclick=removeselection('${row.uid}')><i class="material-icons">close</i></a></td>`
                    :``
                )
                +
                (
                    (row.state == 5)
                    ?`  <td><span class="accent-color-text">Bet Created</span></td>
                        <td><a class="btn-floating btn-small waves-effect waves-light red" onclick=removeselection('${row.uid}')><i class="material-icons">close</i></a></td>`
                    :``
                )
                +
                `

            </tr>
            `
        });
    }else{
        modalhtml+='<h6 class="center">No Bets Selected</h6>';
    }

    modalhtml+=`
            </table>
        </p>
    </div>
    <div class="modal-footer grey darken-4 white-text">
        
    </div>
    `;
    $('.modal').html(modalhtml);
    openmodal();
}

function setcartview(){
    cartview = !(document.querySelector('#modal1').style.display == 'none')
    //console.log(document.querySelector('#modal1').style.display,(document.querySelector('#modal1').style.display == 'none'), cartview);
}

function cartViewingAccoringly(){
    setcartview();
    //console.log('cartview',cartview);
    if(cartview) showmodal();
}

function openmodal(){
    modalinstance.open();
    cartNotOpenYet =false;
    setcartview();
}
function closemodal(){
    modalinstance.close();
    setcartview();
}

//
function restoreview(){
    console.log('restoring view');
    //$('.matchs-container').html('');
    //$('.tabs-container').html('');
    //current();
    if(!(currentcategory=='') && !(currentsubcategory=='') && !(currenttimegame=='') ) {
        //console.log('cat sub and game is loged');
        //scrolltop = $('.matchs-container').scrollTop();
        SelectGame(currenttimegame);
        //$('.matchs-container').scrollTop(scrollTop);
    }else if(!(currentcategory=='') && !(currentsubcategory=='' )){
        //console.log('cat and sub is loged');
        SelectSubCategory(currentsubcategory);
    }else if(!currentcategory==''){
        //console.log('cat is loged');
        SelectCategory(currentcategory);
    }else{
        installCategoryTabs();
    }
    checkallselected();
}
function restorecart(){
    console.log('restoring cart');
    checkedlist.forEach((each,index)=>{
        var filterrow = rawdata.find((row)=>{
            return (row.gsx$bet250.$t == each.mid);
        });
        //console.log(filterrow);
        if(filterrow){
            if(each.state == 1){
                //only update whose bet has not  be created
                each.category       = filterrow.gsx$category.$t;
                each.subcategory    = filterrow.gsx$subcategory.$t;
                each.time           = filterrow.gsx$time.$t;
                each.game           = filterrow.gsx$game.$t;
                each.timegame       = filterrow.gsx$time.$t+filterrow.gsx$game.$t;
                each.description    = filterrow.gsx$description.$t;
                each.team = (each.tid == 'a')? filterrow.gsx$teama.$t : filterrow.gsx$teamb.$t;
                each.odds = (each.tid == 'a')? filterrow.gsx$aodds.$t : filterrow.gsx$bodds.$t;
            }
        }else{
            checkedlist.splice(index,1);
        }
    });
    if(!cartNotOpenYet) cartViewingAccoringly();
}

function setState(uid,state){
    checkedlist[getuidIndexinCheckedlist(uid)].state = state;
    showmodal();
}

function requestCreateBet(uid){
    //console.log('request to createbet from ', uid);
    disablecreateparlaybtn();
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(true)
        },5000);
    })
}

function requestPlaceBet(uid){
    //console.log('request to placebet from ', uid);
    disablecreateparlaybtn();
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(true)
        },5000);
    })
}

function starttimer(uid){
    var sec = 60;
    var rand= Math.random();
    checkedlist[getuidIndexinCheckedlist(uid)].rand = rand;
    //console.log(rand);
    var interval = setInterval(()=>{
        try{
            if(checkedlist[getuidIndexinCheckedlist(uid)].rand == rand){
                //console.log('timer intact');
                if(sec>0){
                    if(sec<=20){
                        $(`.${uid}row td .timer`).addClass('red-text');
                        $(`.${uid}row td .timer`).removeClass('accent-color-text');
                    }
                    $(`.${uid}row td .timer`).html(`${('00'+Math.floor(sec/60)).slice(-2)}:${('00'+Math.floor(sec%60)).slice(-2)}`)
                    sec--;
                }else{
                    setState(uid,1);
                    clearInterval(interval);
                }
            }else{
                //console.log('previous timer session is closing');
                clearInterval(interval);
            }
        }catch(err){}
    },1000);
}

function endtimer(uid){
    checkedlist[getuidIndexinCheckedlist(uid)].rand = 0;
    try{
        //console.log('ending timer');
        clearInterval(checkedlist[getuidIndexinCheckedlist(uid)].intervalfunc);
        checkedlist[getuidIndexinCheckedlist(uid)].intervalfunc ='';
    }catch(err){}
    
    $(`.${uid}row td .timer`).html(``);
}

function createBet(uid){
    setState(uid,2);
    disablecreateparlaybtn();
    showmodal();
    requestCreateBet(uid)
    .then(res=>{
        if(res){
            //console.log('createbet request accepted ', uid);
            setState(uid,3);
            handlecreateparlaystate();
            showmodal();
            starttimer(uid);
        }
    })
    .catch(err=>{console.log( 'create bet err response', uid, err )});
}

function placeBet(uid){
    setState(uid,4);
    endtimer(uid);
    disablecreateparlaybtn();
    showmodal();
    requestPlaceBet(uid)
    .then(res=>{
        if(res){
            //console.log('placebet request accepted ', uid);
            setState(uid,5);
            handlecreateparlaystate();
            showmodal();
        }
    })
    .catch(err=>{console.log('place bet err response ',uid ,err)});
}

function createBetAll(){
    checkedlist.forEach(each=>{
        if(each.state == 1) createBet(each.uid);
    })
}

function areAllBetcreated(){
    var bool = true;
    checkedlist.forEach(each=>{
        bool = (each.state >1) & bool;
    })
    return bool==1;
}

function handlecreateparlaystate(){
    createparlaybtnenabled = !areAllBetcreated();
}

function handlecreateparlay(){
    checkForSameGameSelections();
    var highlightexists= false;
    checkedlist.forEach((eachcheck,index)=>{
        highlightexists = eachcheck.highlight | highlightexists;
    });
    if(highlightexists){
        alert('You have selected more than one selection from the same game');
        showmodal(); return;
    }
    //min linit check
    if(checkedlist.length < minimumSelections){
        alert('Please make atleast 2 selections');
        showmodal(); return;
    }
    createBetAll();
    handlecreateparlaystate();
    showmodal();
}

function enablecreateparlaybtn(){
    createparlaybtnenabled = true;
}
function disablecreateparlaybtn(){
    createparlaybtnenabled = false;
}

function checkForSameGameSelections(){
    var highlights = [];
    checkedlist.forEach((eachcheck,index)=>{
        highlights.push(false);
        checkedlist.forEach((eachcheck2,index2) => {
            if(eachcheck.timegame == eachcheck2.timegame && index != index2){
                highlights[index] = true;
            }
        });
    });
    //console.log(highlights);
    highlights.forEach((each,index)=>{ checkedlist[index].highlight = each });
}



function init(){
    console.log('init');
    configureFrontEnd();
    modalelement = document.querySelector('.modal');
    modalinstance = M.Modal.init(modalelement);
    handlesheet();
    configureFrontEnd();
}

$('#allsports').click(reset);

$(document).ready(init);
$(document).resize(()=>{
    configureFrontEnd();
});
$(document).scroll(()=>{
    configureFrontEnd();
});
