
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

symTbl:`id`name!(0 1 2 3 4;`IBM`AAPL`MSFT`INTC`GS)