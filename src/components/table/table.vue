<template>
  <x-Table>
    <thead>
      <tr>
        <th v-for="(item,ind) in colomns" :key="ind">{{item.title}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row,rowInd) in data"  :key="rowInd">
        <td v-for="(col,colInd) in colomns" :key="colInd">{{row[col.key]}}</td>
      </tr>
    </tbody>
  </x-Table>
</template>

<script>
export default {
  name: "d_table",
  props: {
    colomns: {
      type: Array,
      default() {
        return [
          {
            title: "Name",
            key: "name"
          },
          {
            title: "Age",
            key: "age"
          },
          {
            title: "Address",
            key: "address"
          }
        ];
      }
    },
    data: {
      type: Array,
      default() {
        return [
          {
            name: "John Brown",
            age: 18,
            address: "New York No. 1 Lake Park",
            date: "2016-10-03"
          },
          {
            name: "Jim Green",
            age: 24,
            address: "London No. 1 Lake Park",
            date: "2016-10-01"
          }
        ];
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>