
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