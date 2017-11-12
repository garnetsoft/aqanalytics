Purchase public WIFI: PurchaseGuest 
captaincrunch

https://github.com/miguelgrinberg/Flask-SocketIO


Using Flask with vue.js as a frontend framework

https://aitoehigie.wordpress.com/2016/08/01/using-flask-with-vue-js/


https://npmcdn.com/vue/dist/vue.js

Vue.config.delimiters = ["${", "}"];

<template id="task-template">
  <h1>My Tasks</h1>
  <tasks-app></tasks-app>
  <ul class="list-group">
    <li class="list-group-item" v-for="task in list">
        {% raw %}{{task.body|e}}{% endraw %}
    </li>
  </ul>
</template>


<!-- component template -->
<script type="text/x-template" id="grid-template">
  <table>
    <thead>
      <tr>
        <th v-for="key in columns"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }">
          {% raw %} {{ key | capitalize }} {% endraw %}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData">
        <td v-for="key in columns">
          {% raw %} {{ entry[key] }} {% endraw%}
        </td>
      </tr>
    </tbody>
  </table>
</script>

—– BEGIN LICENSE —–
TwitterInc
200 User License
EA7E-890007
1D77F72E 390CDD93 4DCBA022 FAF60790
61AA12C0 A37081C5 D0316412 4584D136
94D7F7D4 95BC8C1C 527DA828 560BB037
D1EDDD8C AE7B379F 50C9D69D B35179EF
2FE898C4 8E4277A8 555CE714 E1FB0E43
D5D52613 C3D12E98 BC49967F 7652EED2
9D2D2E61 67610860 6D338B72 5CF95C69
E36B85CC 84991F19 7575D828 470A92AB
—— END LICENSE ——

symTbl:`id`name!(0 1 2 3 4;`IBM`AAPL`MSFT`INTC`GS);
smTbl:flip symTbl

pivot table:

q)meta t
c   | t f a
----| -----
id  | j   g
ts  | j
tp  | f
time| p
name| s
q)

1: sym as columns:

  q)exec (exec distinct name from t)#name!ts by mm:15 xbar time.minute from t

  or 
  exec `$(exec string asc distinct name from t)#(`$string name)!ts by mm:15 xbar time.minute from t

2. time as columns:

  q) t1:exec vol:sum ts by name, mm:15 xbar time.minute from t

  q) c1:`$exec string asc distinct mm from t1

  q) exec c1#(`$string mm)!vol by sym:name from t1

http://www.matthieuamiguet.ch/blog/synchronize-clients-flask-application-websockets