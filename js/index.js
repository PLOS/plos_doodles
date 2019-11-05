// leaderboard

// publication_date:[2018-10-01T00:00:00 TO 2018-12-21T23:59:59Z]
$(document).ready(function(){
  $('#journal-select').append('<option selected value="all">All journals</option>')
  for (var journal in JOURNALS) {
    $('#journal-select').append(`<option value="${journal}">${JOURNALS[journal].name}</option>`)
  }
  leaderboard();
})

var journalInterval = 45000;

function searchUrl() {
  return "https://api.plos.org/search?callback=?"
}

$('#journal-select').on('change', function(e) {
  console.log(this.value)
  var src = this.value == 'all' ? 'http://www.plos.org/images/logo-plos.svg' : JOURNALS[this.value].header_image
  $('#journal-logo').attr('src', src)
  leaderboard();
})

$('#cycle').on('change', function(e) {
  if (e.target.checked) {
    window.cycleInterval = setInterval(cycleJournals, journalInterval)
  } else {
    clearInterval(window.cycleInterval)
  }
})

function cycleJournals() {
  var opts = ['all'].concat(Object.keys(JOURNALS)).sort()
  var nextIdx = opts.indexOf($('#journal-select').val()) + 1
  var value = nextIdx == opts.length ? 'all' : opts[nextIdx]
  $('#journal-select').val(value).change()
  setTimeout(() => {
    $("html, body").animate({ scrollTop: $(document).height() }, journalInterval - 3000, 'linear');
  }, 3000)
}

function leaderboard() {
  ['#week', '#month', '#year', '#trending'].forEach(function(elementId) {
    $(elementId).html(
      `<div class="progress">
        <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
        </div>
      </div>`
    )
  })
  var now = new Date
  var nowMs = now.getTime()
  var oneDayMs = 24 * 60 * 60 * 1000
  var twoDaysAgo = new Date(nowMs - (2 * oneDayMs))
  var lastWeek = new Date(nowMs - (7 * oneDayMs))
  var lastMonth = new Date(nowMs - (30 * oneDayMs))
  var lastYear = new Date(nowMs - (365 * oneDayMs))
  $.getJSON(searchUrl(), queryStringData(lastWeek, now, 'lastWeekCallback'))
  $.getJSON(searchUrl(), queryStringData(lastMonth, now, 'lastMonthCallback'))
  $.getJSON(searchUrl(), queryStringData(lastYear, now, 'lastYearCallback'))
  $.getJSON(searchUrl(), queryStringData(new Date(0), now, 'trendingCallback', 'counter_total_month'))
}

function lastWeekCallback(data) { buildListItems(data, '#week') }
function lastMonthCallback(data) { buildListItems(data, '#month') }
function lastYearCallback(data) { buildListItems(data, '#year') }
function trendingCallback(data) { buildListItems(data, '#trending')}

function queryStringData(startDate, endDate, callback, counter='counter_total_all') {
  var query = `publication_date:[${startDate.toISOString()} TO ${endDate.toISOString()}] AND doc_type:"full"`
  query += ' -article_type:"Issue Image"'
  if ($('#journal-select').val() != 'all') {
    query += ` AND journal_key:"${JOURNALS[$('#journal-select').val()].journalKey}"`
  }
  var journal = $('#journal-select').val()
  return {
    sort: `${counter} desc`,
    fl: `id,title,journal_name,${counter}`,
    wt: 'json',
    'json.wrf': callback,
    q: query
  }
}

function buildListItems (data, elementId) {
  $(elementId).html(''); // clear old html
  var listItems =  data.response.docs.map(function(article, idx){
    var journal = `<h6>${idx + 1}. ${article.journal_name}</h6>`
    var anchor = `<p><a href="https://dx.plos.org/${article.id}">${article.title}</a></p>`
    var doi = `<em>${article.id}</em>`
    var badge = `<span class="badge">${article.counter_total_all || article.counter_total_month || 'No Data'}</span>`
    return `<li class="list-group-item">${badge}${journal}${anchor}${doi}</li>`
  }).join('')
  $('<ul/>', {class: "list-group", html: listItems}).appendTo(elementId)
}

var JOURNALS = {
  'pbio': {
    'new_hostname': 'http://journals.plos.org/plosbiology',
    'old_hostname': 'http://www.plosbiology.org',
    'shortcode': 'bio',
    'journalKey': 'PLoSBiology',
    'name': 'PLOS Biology',
    'color': '#16A127',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_bio_h.png'
  },
  'pcbi': {
    'new_hostname': 'http://journals.plos.org/ploscompbiol',
    'old_hostname': 'http://www.ploscompbiol.org',
    'shortcode': 'cbi',
    'journalKey': 'PLoSCompBiol',
    'name': 'PLOS Computational Biology',
    'color': '#16A127',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_cb_h.png'
  },
  'pgen': {
    'new_hostname' : 'http://journals.plos.org/plosgenetics',
    'old_hostname': 'http://www.plosgenetics.org',
    'shortcode': 'gen',
    'journalKey': 'PLoSGenetics',
    'name': 'PLOS Genetics',
    'color': '#16A127',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_gen_h.png'
  },
  'pmed': {
    'new_hostname': 'http://journals.plos.org/plosmedicine',
    'old_hostname': 'http://www.plosmedicine.org',
    'shortcode': 'med',
    'journalKey': 'PLoSMedicine',
    'name': 'PLOS Medicine',
    'color': '#891FB1',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_med_h.png'
  },
  'pntd': {
    'new_hostname': 'http://journals.plos.org/plosntds',
    'old_hostname': 'http://www.plosntds.org',
    'shortcode': 'ntd',
    'journalKey': 'PLoSNTD',
    'name': 'PLOS Neglected Tropical Diseases',
    'color': '#891FB1',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/2/PLOS_ntd_h_tenth.png'
  },
  'pone': {
    'new_hostname': 'http://journals.plos.org/plosone',
    'old_hostname': 'http://plosone.org',
    'shortcode': 'one',
    'journalKey': 'PLoSONE',
    'name': 'PLOS ONE',
    'color': '#F8AF2D',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_one_h_tenth.png'
  },
  'ppat': {
    'new_hostname': 'http://journals.plos.org/plospathogens',
    'old_hostname': 'http://www.plospathogens.org',
    'shortcode': 'pat',
    'journalKey': 'PLoSPathogens',
    'name': 'PLOS Pathogens',
    'color': '#891FB1',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_path_h.png'
  }
}
