
console.log('testing VueJS ...')
console.log('testing VueJS2 ...')

// Vue.config.delimiters = ["${", "}"];
// Vue.config.delimiters = ["[[", "]]"];

// register the grid component
Vue.component('demo-grid', {
  delimiters: ["[[", "]]"],
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
})


//var flaskName2 = "{{ who }}" 

// bootstrap the demo
/*
var demoOld = new Vue({
  el: '#demo',
  delimiters: ["[[", "]]"],
  data: {
    searchQuery: '',
    gridColumns: ['name', 'power'],
    gridData: [
      { name: 'Chuck Norris', power: Infinity },
      { name: 'Bruce Lee', power: 9000 },
      { name: 'Jackie Chan', power: 7000 },
      { name: 'George Feng', power: 7000 },
      { name: 'Jet Li', power: 8000 }
    ],
    fname: 'George',
    lname: 'Feng',
    flaskName2: flaskName2,
  }
})
*/


//var haha =  JSON.parse(vueCols)
//var hehe =  JSON.parse(vueData)
console.log('xxxx')
console.log(flaskName2)

console.log("xxxx vueColsList: ")
console.log(typeof(vueColsList))
console.log(vueColsList)
console.log("xxxx vueColsJson: ")
console.log(typeof(vueCols))
console.log(vueCols)
console.log("xxxx vueData: ")
console.log(typeof(vueData))
console.log(vueData)

//console.log(JSON.parse(vueData))

var demo = new Vue({
  el: '#demo',
  delimiters: ["[[", "]]"],
  data: {
    searchQuery: '',
    gridColumns: JSON.parse('["name", "power"]'),
    gridColumns: JSON.parse(vueCols+''),

    gridData: [
      { name: 'Chuck Norris', power: Infinity },
      { name: 'Bruce Lee', power: 9000 },
    ],
    fname: 'George',
    lname: 'Feng',
    flaskName2: flaskName2,
  }
})
