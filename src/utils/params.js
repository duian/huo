
const carLength = [
  { label: '22米', value: 10 },
  { label: '17.5米', value: 3 },
  { label: '15米', value: 9 },
  { label: '13米', value: 2 },
  { label: '11米', value: 8 },
  { label: '9.6米', value: 1 },
  { label: '7.6米', value: 7 },
  { label: '6.8米', value: 6 },
  { label: '5.2米', value: 5 },
  { label: '4.2米', value: 4 },
  { label: '其他', value: 0 },
];

// 其他值应该为0，但是组件本身bug，不支持这种表达方式，所以特意将其他的值设置为100
// 个人信息 － 车长车型编辑
// 注册 － 车长车型选择
const carType = [
  { label: '高栏车(高栏/立柱可拆)', value: 14, children: carLength },
  { label: '高栏车(高栏可拆)', value: 12, children: carLength },
  { label: '高栏车(立柱可拆)', value: 13, children: carLength },
  { label: '高栏车(无要求)', value: 11, children: carLength },
  { label: '低栏车', value: 10, children: carLength },
  { label: '平板车', value: 1, children: carLength },
  { label: '半箱式', value: 6, children: carLength },
  { label: '箱式车', value: 7, children: carLength },
  { label: '冷藏车', value: 8, children: carLength },
  { label: '特型车', value: 9, children: carLength },
  { label: '其他', value: 100, children: carLength },
];

const carAxis = [
  { label: '2轴', value: 2 },
  { label: '3轴', value: 3 },
  { label: '4轴', value: 4 },
  { label: '5轴', value: 5 },
  { label: '6轴', value: 6 },
  { label: '7轴', value: 7 },
  { label: '8轴', value: 8 },
];

const tags = [
  { name: '京' },
  { name: '津' },
  { name: '沪' },
  { name: '渝' },
  { name: '冀' },
  { name: '豫' },
  { name: '云' },
  { name: '辽' },
  { name: '黑' },
  { name: '湘' },
  { name: '皖' },
  { name: '鲁' },
  { name: '新' },
  { name: '苏' },
  { name: '浙' },
  { name: '赣' },
  { name: '鄂' },
  { name: '桂' },
  { name: '甘' },
  { name: '晋' },
  { name: '蒙' },
  { name: '陕' },
  { name: '吉' },
  { name: '闽' },
  { name: '贵' },
  { name: '粤' },
  { name: '青' },
  { name: '藏' },
  { name: '川' },
  { name: '宁' },
  { name: '琼' },
];

export default {
  carLength,
  carType,
  tags,
  carAxis,
};
