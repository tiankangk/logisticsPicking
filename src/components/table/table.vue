<template>
  <div class="table" :style="{width:'100%',overflow:'auto hidden'}">
    <x-Table
      :content-bordered="false"
      :cell-bordered="false"
      :style="{fontSize:'0.2rem',display:'flex',flexDirection: 'column',width:'fit-content',maxHeight:height}"
    >
      <thead>
        <tr>
          <th :style="{minWidth:item.minWidth+'px'}" v-for="(item,ind) in columns" :key="ind">
            <d-checkbox
              :style="{verticalAlign: 'middle'}"
              v-if="item.type==='checkbox'"
              @change="allChange"
              v-model="checkedAll"
            ></d-checkbox>
            <span v-else>{{item.title}}</span>
          </th>
        </tr>
      </thead>
      <!-- :style="{padding:'0.1rem'}" -->
      <tbody :style="{flex:1,overflow:'auto',width:'fit-content'}">
        <template v-if="0 in newData">
          <tr v-for="(row,rowInd) in newData" :key="rowInd">
            <td v-for="(col,colInd) in columns" :key="colInd" :style="{minWidth:col.minWidth+'px'}">
              <d-checkbox
                v-if="col.type==='checkbox'|| col.type==='radio'"
                @change="rowChange($event,row)"
                :style="{verticalAlign: 'middle'}"
                v-model="row.checked"
              ></d-checkbox>
              <span v-else>{{row[col.key]}}</span>
            </td>
          </tr>
        </template>

        <tr v-else>
          <td :colspan="columns.length" :style="{textAlign:'center',width:tableWidth+'px'}">没有数据</td>
        </tr>
      </tbody>
    </x-Table>
  </div>
</template>

<script>
export default {
  name: "d_table",
  props: {
    height: {
      type: String,
      default() {
        return "";
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },

    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      checkedAll: false
    };
  },
  computed: {
    tableWidth() {
      return document.getElementsByClassName("table")[0].offsetWidth;
    },
    checkedType() {
      let row = this.columns.find(item => {
        return "type" in item;
      });
      return row.type;
    },
    newData() {
      return this.data.map(item => {
        if (!("checked" in item)) {
          this.$set(item, "checked", false);
        }

        return item;
      });
    }
  },
  methods: {
    selectChange() {
      let selectList = this.data.filter(item => item.checked);
      let newSelectList = undefined;
      if (0 in selectList) {
        if (this.checkedType === "radio") {
          newSelectList = selectList[0];
        } else {
          newSelectList = selectList;
        }
      } else {
        if (this.checkedType === "radio") {
          newSelectList = {};
        } else {
          newSelectList = [];
        }
      }

      this.$emit("on-selection-change", newSelectList);
    },
    allChange(val) {
      this.data.forEach(item => {
        item.checked = val;
      });
      this.selectChange();
    },
    rowChange(val, row) {
      if (this.checkedType === "radio") {
        this.data.forEach(item => {
          item.checked = false;
        });
        row.checked = true;
      } else {
        this.checkedAll = this.data.every(item => item.checked);
      }
      this.selectChange();
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
</style>