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
    console.log('handle1');
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
        installCategoryTabs();
        ///refresh();
    }).then(()=>{
        //setInterval(handlesheet,30000);
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
    //current();
    $('.heading-container h6').html(`${currentcategory}`);
}

function installSubcategoryTabs(){
    var html =""
    categories[currentcategory].data.forEach(subcategory=>{
        html+=`<div onclick="SelectSubCategory('${subcategory}')" class="tab-container center"><div class="btn btn-small tab">${subcategory}</div></div>`;
    });
    $('.tabs-container').html(html);
    configureFrontEnd();
} 

function SelectSubCategory(subcat){
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
    //current();
}

function SelectGame(game){
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
            <td>${row.mid}</td>
        </tr>`;
    })
    html+="</table></div>";
    $('.matchs-container').html(html);
    $('.heading-container h6').html(`${currentcategory} > ${currenttimegame}`);
    $('input[type="radio"]').prop('checked',false);
    checkallselected();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function configureFrontEnd(){
    var calheight = $(window).height()- $('.data-block').height() +$('.matchs-container').height() -1;
    $('.matchs-container').height(calheight);
}

function reset(){
    currentcategory = currentsubcategory = currentmatch = '';
    installCategoryTabs();
    $('.matchs-container').html('');
    $('.heading-container h6').html('Fairlay App');
    configureFrontEnd();
}


function init(){
    console.log('init');
    configureFrontEnd();
    modalelement = document.querySelector('.modal');
    modalinstance = M.Modal.init(modalelement);
    handlesheet();
    //handlesheet2();
    configureFrontEnd();
    //$('.modal').modal();
    //refresh();
}


$('#allsports').click(reset);
$(document).ready(init);
$(document).resize(()=>{
    configureFrontEnd();
});
$(document).scroll(()=>{
    configureFrontEnd();
});

function current(){
    console.log('current',currentcategory,currentsubcategory, currenttimegame);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        
var elems = document.querySelectorAll('.modal');
var instances = M.Modal.init(elems, options);

function uncheckall(){
    $('input[type="radio"]').prop('checked',false);
}


function finduidinCheckedlist(uid){
    return checkedlist.findIndex((elem,index)=>{
        if(elem.uid == uid){
            return true;
        }
    });
}

function checkallselected(){
    checkedlist.forEach(each=>{
        $(`#${each.uid}`).prop('checked',true);;
    })
}

function removeselection(uid){
    var uidindex = finduidinCheckedlist(uid);
    checkedlist.splice(uidindex,1);
    $(`#${uid}`).prop('checked',false);
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
        odds: (tid == 'a')? current.gsx$aodds.$t : current.gsx$bodds.$t 
    }
    return checkobj;
}

function handlecheck(uid){
    console.log(uid);
    var mid =uid.slice(1);
    var complementuid = ((uid.charAt(0) == 'a')? 'b' : 'a' )+uid.slice(1);
    var uidindex = finduidinCheckedlist(uid);
    var complementuidindex = finduidinCheckedlist(complementuid);
    
    console.log('uid',uid,uidindex, '|', 'complementuid',complementuid, complementuidindex);
    if(complementuidindex>-1){
        checkedlist.splice(complementuidindex,1);
        $(`#${complementuid}`).prop('checked',false);
    }
    if(checkedlist.length < 5){
        if(uidindex > -1){
            checkedlist.splice(uidindex,1);
            $(`#${uid}`).prop('checked',false);
        }else{
            checkedlist.push(getcheckobj(uid));
            $(`#${uid}`).prop('checked',true);
            showmodal();
        }
    }else{
        alert('Maximum limit to make selections is 5 only.');
        showmodal();
    }
    console.log(checkedlist);
    
}

function showmodal(){
    var modalhtml =`
    <div class="modal-content">
        <div class="btn-container center"><div class="btn btn-small banner-button blue">Create Parlay</div></div>
        <p class="white-text">
            <table class="tabledata">
    `

    if(checkedlist.length>0){
        checkedlist.forEach(row=>{
            modalhtml+=`
            <tr>
                <td>${row.game}</td>
                <td>${row.description}</td>
                <td>${row.team}</td>
                <td>${row.odds}</td>
                <td><a href="#!" class="modal-close waves-effect waves-green btn btn-small accent-color-button">BET!</a></td>
                <td><a class="btn-floating btn-small waves-effect waves-light red"><i onclick=removeselection('${row.uid}')  class="material-icons">close</i></a></td>
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

function openmodal(){
    modalinstance.open();
}
function closemodal(){
    modalinstance.close();
}


function refresh(){
    $('.matchs-container').html('');
    $('.tabs-container').html('');
    //current();
    console.log('updating view');
    if(!(currentcategory=='') && !(currentsubcategory=='') && !(currenttimegame=='') ) {
        //console.log('cat sub and game is loged');
        SelectGame(currenttimegame);
        if( !(currentcheck=='')){
            setcheck(currentcheck, currentteam, currenttimegame, currentdescription, currentodds);
        }
    }else if(!(currentcategory=='') && !(currentsubcategory=='' )){
        //console.log('cat and sub is loged');
        SelectSubCategory(currentsubcategory);
    }else if(!currentcategory==''){
        //console.log('cat is loged');
        SelectCategory(currentcategory);
    }else{
        installCategoryTabs();
    }
}
