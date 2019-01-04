// helper stuff

var pubMedQueryUrl = "https://www.ncbi.nlm.nih.gov/pubmed/?term="

function updateKeyWords (event) {
  var kWords = $('#key-words').val().split(',');
  var checkboxes = kWords.map((kWord) => {
    var val = kWord.trim();
    return `<label><input type='checkbox' value="${val}">${val}</label>`
  })
  $('#key-word-list').html(checkboxes);
}

function updateAuthorNames (event) {
  var aNames = nameArrayFromInput('#author-names');
  var items = aNames.map((aName) => {
    return `<li>${aName.trim()}</li>`
  })
  updateReviewerNames();
  $('#author-names-list').html(items);
}

function updateReviewerNames (event) {
  var rNames = nameArrayFromInput('#reviewer-names');
  var items = rNames.map(function(rName) {
    var url = pubMedQueryUrl + coAuthorQueryParams(rName);
    return `<li><a target="_blank" href="${url}">Search coauthorships for ${rName.trim()}</a></li>`
  })
  $('#reviewer-names-list').html(items);
}

function coAuthorQueryParams (rName) {
 var aNames = nameArrayFromInput('#author-names');
 var auRune = '[au]'
 var aClauses = aNames.map(function(aName) {
   return aName.trim() + auRune;
 })
 var query = rName.trim() + auRune + `+AND+(${aClauses.join('+OR+')})`
 return query;
}

function searchPubmed () {
  var values = $('#key-word-list > label > input:checked').map(function(i, el) {
    return $(el).val();
  }).get();
  window.open(pubMedQueryUrl + values.join('+AND+'), "_blank")
}

function abbreviateName (name) {
  var nameParts = name.split(' ');
  return `${nameParts[nameParts.length - 1]} ${name.charAt(0)}`
}

function nameArrayFromInput (inputSelector) {
  var formatNames = $('#format-names').is(':checked');
  return $(inputSelector).val().split(',').map(function(name){
    return formatNames ? abbreviateName(name.trim()) : name.trim();
  });
}

function refreshNames () {
  updateReviewerNames();
  updateAuthorNames();
}

// leaderboard

var search = "https://api.plos.org/search?callback=?"
// publication_date:[2018-10-01T00:00:00 TO 2018-12-21T23:59:59Z]
$(document).ready(function(){
  var now = new Date
  var nowMs = now.getTime()
  var oneDayMs = 24 * 60 * 60 * 1000
  var twoDaysAgo = new Date(nowMs - (2 * oneDayMs))
  var lastWeek = new Date(nowMs - (7 * oneDayMs))
  var lastMonth = new Date(nowMs - (30 * oneDayMs))
  var lastYear = new Date(nowMs - (365 * oneDayMs))

  $.getJSON(search, queryStringData(lastWeek, now, 'lastWeekCallback'))
  $.getJSON(search, queryStringData(lastMonth, now, 'lastMonthCallback'))
  $.getJSON(search, queryStringData(lastYear, now, 'lastYearCallback'))
})

function lastWeekCallback(data) { buildListItems(data, '#week') }
function lastMonthCallback(data) { buildListItems(data, '#month') }
function lastYearCallback(data) { buildListItems(data, '#year') }

function queryStringData(startDate, endDate, callback, counter='counter_total_all') {
  return {
    sort: `${counter} desc`,
    fl: `id,title,journal_name,${counter}`,
    wt: 'json',
    'json.wrf': callback,
    q: `publication_date:[${startDate.toISOString()} TO ${endDate.toISOString()}]`
  }
}

function buildListItems (data, elementId) {
  var listItems =  data.response.docs.map(function(article){
    var journal = `<h6>${article.journal_name}</h6>`
    var anchor = `<p><a href="https://journals.plos.org${article.link}">${article.title}</a></p>`
    var badge = `<span class="badge">${article.counter_total_all}</span>`
    return `<li class="list-group-item">${badge}${journal}${anchor}</li>`
  }).join('')
  $('<ul/>', {class: "list-group", html: listItems}).appendTo(elementId)
}
