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