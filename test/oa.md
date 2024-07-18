**oa框架：**

- [x] 前端列表导出Excel

- [x] 适配pc端小屏(px2rem插件)
- [x] 自定义指令转换元素px单位
- [x] 防止重复请求
- [x] 登入登出（登录状态过期或会话无效情况，需要退出）
- [ ] 用户信息等公用方法
- [ ] 数据缓存(字典方式)
- [ ] 菜单导航栏



财税-订单管理-未做部分

1. 导入客户 （没测试
2. 操作-订单类别-添加收据服务
3. 操作-其他-更改报税月







总监审核：

场景：

contract.type=3 转换类型 

合同编号：Z0027980 （操作： 销售总监审核通过

合同编号：DZ00502002 中山市古镇尚朵灯饰厂 （财务审核-驳回 测试 

合同编号：Z0027980

开平市威米奥贸易有限公司 （转换合同 - 财务审核通过

黎川县趋弗焱贸易有限公司（财务审核通过



**财税、抖音、建筑资质客户管理**

新增订单（复杂表单页面，根据条件复用）

公司信息- 合同类型 - 根据入口（新签、续费、转换、增值、老客户新签、收据） 标记默认选中

服务内容 - 记账单数（固定 ：0、0.5、1）

服务内容- 服务类型为代理记账 

服务项目 加购 id=22

**服务类型含有”注册“或服务服务项目”税务登记“  （是否有账目 则 选中 新注册）**

服务类型 是 接账(会计) （是否有账目 则 选中 切账）

服务类型 选 租用地址 id=28

租用地址公司性质 前端固定下拉数据

选电子合同 保存时 出现确认框提示。（提示内容 代码里找）







**订单管理列表**

修改合同：

1. 当该合同审核状态reviewStatus：3（电子合同）和 isElectronics：1 （已签未提交），则出现 **已签未提交检查** 按钮
2. 保存修改前验证表单，









缺少：

1. contractSheetId //填写交接单 
2. woIdList =[]//填写资料单
3. pickUpBillId //接账单
4. areaId_select // *可能是区域id集合



缺少，已补：

1. cluePartnerType //线索合伙人类型

2. lkh //老客户 （客户来源 选中老客户转介绍id=6时 显示）

3. serviceAmounts // 数组类型； 减去优惠后实付金额

4. sn //合同编号

5. receiptSn // 收据编号

6. rentAddrSd // 租用地址开始日期

   "https://oss.oa.zcmtech.cn/fortune_cat/20240315/382f00be-8121-45e9-80b1-17604a48897f.png"
   
   "https://oss.oa.zcmtech.cn/fortune_cat/20240315/1fea953a-a624-4d74-9b93-c5f804e2ef8c.png"

```javascript
{
    "busSysType": "A",
    "staffId": 1,
    "zcmCompany": "火炬分公司",
    "isRelateClue": "1",
    "clueId": "1663794455293337602",
    "clueSn": "XS166379445529",
    "clueName": "招小喵",
    "clueMobile": "13863999999",
    "clueProduct": "工商代办 记账报税 抖音推广",
    "clueMemo": "想注册",
    "clueStaffName": "超级管理员",
    "cluePartnerName": "测试会计",
    "cluePartnerMobile": "13079065606",
    "customerType": "2",
    "customerId": 80008,
    "companyType": "2",
    "customerCompanyId": 33756,
    "customerName": "马仕平",
    "customerMobile": "13925387680",
    "companyIndustryId": 4,
    "companyIndustryId2": 43,
    "companyTypeId": 1,
    "areaId": 442000103,
    "areaIds": [
        44,
        4420,
        442000103
    ],
    "companyName": "中山市欧义照明电器有限公司",
    "companyLegalPerson": "马仕平",
    "companyLegalMobile": "13925387680",
    "companyIndustryTypeId": 3,
    "contactName": "马仕平",
    "contactMobile": "13925387680",
    "taxType": 1,
    "customerSourceId": 5,
    "lkh": "",
    "type": "1",
    "curAddresssAdd": "东凤",
    "servicesIds": [
        70,
        1,
        28,
        1
    ],
    "servicesProjectIds": [
        1166,
        1,
        967,
        22
    ],
    "fullServiceAmounts": [
        "110",
        "1222",
        "120",
        "100"
    ],
    "coupon": [
        "12",
        "12",
        "10",
        "0"
    ],
    "serviceAmounts": 100,
    "sbmSysDate": "2024-3-13",
    "isFrontMoneyMemo": "不啵啵啵啵啵啵啵啵啵啵啵啵",
    "orderCount": "0.5",
    "isFrontMoney": "0",
    "customerAccountId": 1,
    "signType": "2",
    "receiptType": "1",
    "sn": "DZ018999999",
    "receiptSn": "1000001",
    "rentAddrSd": "2024-03-12",
    "signDate": "2024-03-12T16:00:00.000Z",
    "upGenTaxDate": "2024-04",
    "contractApplyId": 30626,
    "receiptContractApplyId": 130655,
    "salaryDate": "结算世间",
    "contractSetMealId": 258,
    "fullPrice": "1552.00",
    "discountAmount": "34.00",
    "price": "1518.00",
    "licenseSetDate": "2024-03-19T16:00:00.000Z",
    "memo": "备注啊飒飒飒飒",
    "undefined": "",
    "payImageUrls": [
        "https://oss.oa.zcmtech.cn/fortune_cat/20240313/5220e84e-acf7-4583-ab0d-1e3634c39024.png",
        "https://oss.oa.zcmtech.cn/fortune_cat/20240313/df34ee75-f779-4b9e-833e-e7767f573709.png"
    ],
    "imageUrls": "",
    "receiptUrls": [
        "https://oss.oa.zcmtech.cn/fortune_cat/20240313/b2830d95-9ef2-4e46-9125-129b448f6f67.jpeg"
    ],
    "legalCardUrls": [
        "https://oss.oa.zcmtech.cn/fortune_cat/20240313/9ce3cf7b-62c6-4468-839d-c07bbedcd1e7.png",
        "https://oss.oa.zcmtech.cn/fortune_cat/20240313/13661c4f-90e2-4dce-8865-e2174fcdcf8a.png"
    ],
    "businessUrls": [
        "https://oss.oa.zcmtech.cn/fortune_cat/20240313/a8aa754e-f809-4933-a32f-c37bfff36146.png"
    ],
    "fileAttachmentsUrl": "https://oss.oa.zcmtech.cn/fortune_cat/20240313/881714fb-944f-4f5e-a957-39c127d986ab.xlsx",
    "accountingStart": 3,
    "accountingStartDate": "2024-04",
    "serviceStartDate": "合同的服务期开始",
    "serviceMonth": "10",
    "totalDuration": 12,
    "sendServiceMonth": "1",
    "additionServiceMonth": "1",
    "rentAddrDate": [
        "2024-03-12",
        "2024-04-24"
    ],
    "rentAddrEd": "2024-04-24",
    "rentAddrDays": 44,
    "rentAddrTypeCheck": "2",
    "rentAddrType": "2",
    "rentAddrSn": "DQ-S-40",
    "rentAddrCaseId": 2,
    "rentAddr": "租用地址QWW",
    "isCompany": "1",
    "companyNameOther": "公司名称",
    "companyTaxNo": "税号321312",
    "frIdCard": "440922192837382911",
    "cusAddress": "地址强强强强",
    "ownerCompanyId": 7
}

// const props = {

​    //  busSysType: "A",

​    //  staffId: 1,

​    //  zcmCompany: "集团",

​    //  isRelateClue: "0",

​    //  clueId: "",

​    //  clueSn: "",

​    //  clueName: "",

​    //  clueMobile: "",

​    //  clueProduct: "",

​    //  clueMemo: "",

​    //  clueStaffName: "",

​    //  cluePartnerName: "",

​    //  cluePartnerMobile: "",

​    //  cluePartnerType: "",

​    //  customerType: "2",

​    //  customerId: "",

​    //  companyType: "1",

​    //  customerCompanyId: "",

​    //  customerName: "test0",

​    //  customerMobile: "13112934726",

​    //  companyIndustryId: 1,

​    //  companyIndustryId2: 16,

​    //  companyTypeId: 1,

​    //  areaId: 4401,

​    //  areaIds: [44, 4401],

​    //  companyName: "test0",

​    //  companyLegalPerson: "test0",

​    //  companyLegalMobile: "13119242042",

​    //  companyIndustryTypeId: 2,

​    //  contactName: "test0",

​    //  contactMobile: "13112934726",

​    //  taxType: 1,

​    //  customerSourceId: 5,

​    //  lkh: "",

​    //  type: "1",

​    //  curAddresssAdd: "test0",

​    //  servicesIds: [69],

​    //  servicesProjectIds: [1019],

​    //  fullServiceAmounts: ["1200"],

​    //  coupon: ["12"],

​    //  serviceAmounts: [1188],

​    //  sbmSysDate: "2024-03-13",

​    //  isFrontMoneyMemo: "",

​    //  orderCount: "0",

​    //  isFrontMoney: "0",

​    //  customerAccountId: 1,

​    //  signType: "1",

​    //  receiptType: "",

​    //  sn: "CS701",

​    //  receiptSn: "25701",

​    //  rentAddrSd: "",

​    //  payImageUrls: [],

​    //  imageUrls: [],

​    //  legalCardUrls: [],

​    //  businessUrls: [],

​    //  receiptImageFile: [

​    //   "https://oss.oa.zcmtech.cn/fortune_cat/20240313/2c615bca-6607-4885-bc87-514c4b81e177.png"

​    //  ],

​    //  receiptUrls:

​    //   "https://oss.oa.zcmtech.cn/fortune_cat/20240313/2c615bca-6607-4885-bc87-514c4b81e177.png",

​    //  signDate: "2024-03-12",

​    //  upGenTaxDate: "",

​    //  contractApplyId: 289654,

​    //  salaryDate: "12212",

​    //  contractSetMealId: 258,

​    //  fullPrice: "1200.00",

​    //  discountAmount: "12.00",

​    //  price: "1188.00",

​    //  licenseSetDate: "2024-03-20",

​    //  memo: "aaaaaaa",

​    //  undefined: "",

​    //  fileAttachmentsUrl: "",

​    //  receiptContractApplyId: "",

​    //  contractSheetId: 45096,

​    //  woIdList: [],

​    // };
```

