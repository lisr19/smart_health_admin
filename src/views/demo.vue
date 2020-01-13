<template>
    <div>this is a demo</div>
</template>

<script>
  import util from '@/libs/util.js';
  export default {
    name: 'demo',
    data () {
      return {
        array: [
          {
            "id": 1,
            "name": "亚洲",
            "pid": 0,
            "path": ",1,",
            "level": 1
          },
          {
            "id": 2,
            "name": "欧洲",
            "pid": 0,
            "path": ",2,",
            "level": 1
          },
          {
            "id": 3,
            "name": "非洲",
            "pid": 0,
            "path": ",3,",
            "level": 1
          },
          {
            "id": 4,
            "name": "北美",
            "pid": 0,
            "path": ",4,",
            "level": 1
          },
          {
            "id": 5,
            "name": "南美",
            "pid": 0,
            "path": ",5,",
            "level": 1
          },
          {
            "id": 6,
            "name": "大洋洲",
            "pid": 0,
            "path": ",6,",
            "level": 1
          },
          {
            "id": 7,
            "name": "中国",
            "pid": 1,
            "path": ",1,7,",
            "level": 2
          },
          {
            "id": 8,
            "name": "阿尔巴尼亚",
            "pid": 2,
            "path": ",2,8,",
            "level": 2
          },
          {
            "id": 9,
            "name": "阿尔及利亚",
            "pid": 3,
            "path": ",3,9,",
            "level": 2
          },
          {
            "id": 10,
            "name": "阿富汗",
            "pid": 1,
            "path": ",1,10,",
            "level": 2
          },
          {
            "id": 11,
            "name": "阿根廷",
            "pid": 5,
            "path": ",5,11,",
            "level": 2
          },
          {
            "id": 12,
            "name": "阿拉伯联合酋长国",
            "pid": 1,
            "path": ",1,12,",
            "level": 2
          },
          {
            "id": 13,
            "name": "阿鲁巴",
            "pid": 5,
            "path": ",5,13,",
            "level": 2
          },
          {
            "id": 14,
            "name": "阿曼",
            "pid": 1,
            "path": ",1,14,",
            "level": 2
          },
          {
            "id": 15,
            "name": "阿塞拜疆",
            "pid": 1,
            "path": ",1,15,",
            "level": 2
          },
          {
            "id": 16,
            "name": "阿森松岛",
            "pid": 3,
            "path": ",3,16,",
            "level": 2
          },
          {
            "id": 17,
            "name": "埃及",
            "pid": 3,
            "path": ",3,17,",
            "level": 2
          },
          {
            "id": 18,
            "name": "埃塞俄比亚",
            "pid": 3,
            "path": ",3,18,",
            "level": 2
          },
          {
            "id": 19,
            "name": "爱尔兰",
            "pid": 2,
            "path": ",2,19,",
            "level": 2
          },
          {
            "id": 20,
            "name": "爱沙尼亚",
            "pid": 2,
            "path": ",2,20,",
            "level": 2
          },
          {
            "id": 21,
            "name": "安道尔",
            "pid": 2,
            "path": ",2,21,",
            "level": 2
          },
          {
            "id": 22,
            "name": "安哥拉",
            "pid": 3,
            "path": ",3,22,",
            "level": 2
          },
          {
            "id": 23,
            "name": "安圭拉",
            "pid": 5,
            "path": ",5,23,",
            "level": 2
          },
          {
            "id": 24,
            "name": "安提瓜岛和巴布达",
            "pid": 4,
            "path": ",4,24,",
            "level": 2
          },
          {
            "id": 25,
            "name": "澳大利亚",
            "pid": 6,
            "path": ",6,25,",
            "level": 2
          },
          {
            "id": 26,
            "name": "奥地利",
            "pid": 2,
            "path": ",2,26,",
            "level": 2
          },
          {
            "id": 27,
            "name": "奥兰群岛",
            "pid": 2,
            "path": ",2,27,",
            "level": 2
          },
          {
            "id": 28,
            "name": "巴巴多斯岛",
            "pid": 5,
            "path": ",5,28,",
            "level": 2
          },
          {
            "id": 29,
            "name": "巴布亚新几内亚",
            "pid": 6,
            "path": ",6,29,",
            "level": 2
          },
          {
            "id": 30,
            "name": "巴哈马",
            "pid": 4,
            "path": ",4,30,",
            "level": 2
          },
          {
            "id": 31,
            "name": "巴基斯坦",
            "pid": 1,
            "path": ",1,31,",
            "level": 2
          },
          {
            "id": 32,
            "name": "巴拉圭",
            "pid": 5,
            "path": ",5,32,",
            "level": 2
          },
          {
            "id": 33,
            "name": "巴勒斯坦",
            "pid": 1,
            "path": ",1,33,",
            "level": 2
          },
          {
            "id": 34,
            "name": "巴林",
            "pid": 1,
            "path": ",1,34,",
            "level": 2
          },
          {
            "id": 35,
            "name": "巴拿马",
            "pid": 4,
            "path": ",4,35,",
            "level": 2
          },
          {
            "id": 36,
            "name": "巴西",
            "pid": 5,
            "path": ",5,36,",
            "level": 2
          },
          {
            "id": 37,
            "name": "白俄罗斯",
            "pid": 2,
            "path": ",2,37,",
            "level": 2
          },
          {
            "id": 38,
            "name": "百慕大",
            "pid": 4,
            "path": ",4,38,",
            "level": 2
          },
          {
            "id": 39,
            "name": "保加利亚",
            "pid": 2,
            "path": ",2,39,",
            "level": 2
          },
          {
            "id": 40,
            "name": "北马里亚纳群岛",
            "pid": 4,
            "path": ",4,40,",
            "level": 2
          },
          {
            "id": 41,
            "name": "贝宁",
            "pid": 3,
            "path": ",3,41,",
            "level": 2
          },
          {
            "id": 42,
            "name": "比利时",
            "pid": 2,
            "path": ",2,42,",
            "level": 2
          },
          {
            "id": 43,
            "name": "冰岛",
            "pid": 2,
            "path": ",2,43,",
            "level": 2
          },
          {
            "id": 44,
            "name": "波多黎各",
            "pid": 4,
            "path": ",4,44,",
            "level": 2
          },
          {
            "id": 45,
            "name": "波兰",
            "pid": 2,
            "path": ",2,45,",
            "level": 2
          },
          {
            "id": 46,
            "name": "玻利维亚",
            "pid": 5,
            "path": ",5,46,",
            "level": 2
          },
          {
            "id": 47,
            "name": "波斯尼亚和黑塞哥维那",
            "pid": 2,
            "path": ",2,47,",
            "level": 2
          },]
        ,
      };
    },
    created () {
      let res = util.array2tree(v => {
        v.value = v.id;
        v.label = v.name
      }, this.array);
      console.log(res);
    }
  };
</script>

<style scoped>

</style>
