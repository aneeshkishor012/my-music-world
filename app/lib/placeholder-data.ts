// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/myMusicWorld-app/fetching-data

const users = [
  {"id":"547c26b4-2869-4376-9f68-94a54212afe7","name":"vinesh kishor","email":"vineshkishor17@gmail.com","password":"Vikipaaru@8545","phone":"9000000001"},
  {"id":"1e0268f2-bfb5-4d6c-bddf-cb82bd7de975","name":"admin2","email":"admin2@gmail.com","password":"admin123","phone":"9000000002"},
  {"id":"502e4f17-4b82-451e-940b-1cc54f2ef035","name":"admin","email":"admin@gmail.com","password":"admin@123","phone":"9000000003"},
  {"id":"c720987c-2013-41f1-8088-17ccc53883e6","name":"Vijayalaxmi Sonnad ","email":"vijayalaxmisonnad2002@gmail.com","password":"#puppycat15","phone":"9000000004"},
  {"id":"8a94177d-ac2c-44de-858a-2d994b8b3cb0","name":"Varsha Pashupati ","email":"varshapashupati63@gmail.com","password":"Mukta@pashupati#111","phone":"9000000005"},
  {"id":"410544b2-4001-4271-9855-fec4b6a6442a","name":"User","email":"user@nextmail.com","password":"123456","phone":"9000000006"},
  {"id":"503a04c8-52a0-4e25-9b80-bc4f000f9107","name":"Silpa KP","email":"kpsilpa4@gmail.com","password":"12345678","phone":"9000000007"},
  {"id":"33d8421f-8a64-460e-b500-cc5a50aa537d","name":"Shviani","email":"shivanizadke@gmail.com","password":"OKOKOKOK","phone":"9000000008"},
  {"id":"7ceb69ab-135f-4954-9b7b-41c91a7161c2","name":"Shakuntala","email":"shakuntalamrode19@gmail.com","password":"123456","phone":"9000000009"},
  {"id":"de8cd546-fe32-4562-8d6f-2a3bf8668755","name":"Sezaro","email":"nehamense107@gmail.com","password":"qwerty123","phone":"9000000010"},
  {"id":"2ac905e8-60c3-40fe-aaa4-c0f428478c3b","name":"Rx Ravi ","email":"ravisshilavantar@gmail.com","password":"9591971840","phone":"9000000011"},
  {"id":"75dff664-7e2d-4f86-8cb9-438a33342a04","name":"Megha Pashupati","email":"meghapashupati93@gmail.com","password":"Meghap@1234","phone":"9000000012"},
  {"id":"dd00f8f5-5bcf-43c6-b48e-00e875964bd7","name":"Gowtham","email":"gowthamkanya@gmail.com","password":"aneesh90","phone":"9000000013"},
  {"id":"58e4296f-17e9-45a8-a62f-9cbbefd71a05","name":"Ebinshyam ","email":"cr3489012@gmail.com","password":"Ebin@2002","phone":"9000000014"},
  {"id":"258d3115-8925-450a-a6e4-e7da5497f9e3","name":"Chandrika","email":"chandrikagchinchali@gmail.com","password":"Chandu@16","phone":"9000000015"},
  {"id":"4e165663-cbed-4f6a-b085-867592f4c8f7","name":"Anjali Gouda","email":"01fs21bec002@kletech.ac.in","password":"anju@2001","phone":"9000000016"},
  {"id":"410544b2-4001-4271-9855-fec4b6a6442b","name":"Aneesh","email":"aneesh@gmail.com","password":"Aneesh@2001","phone":"9000000017"},
  {"id":"7d7a9894-34c9-45e3-a424-e2e71055b76a","name":"Admin1","email":"admin1@gmail.com","password":"admin123","phone":"9000000018"}
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

export { users, customers, invoices, revenue };
