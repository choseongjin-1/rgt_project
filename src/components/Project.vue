<template>
  <div>
    <div v-show="tableData.length > 0">
      <table>
        <thead>
          <tr>
            <th>order_id</th>
            <th>product_name</th>
            <th>orderer_name</th>
          </tr>
        </thead>
        <tbody>
          <!-- 데이터를 반복문으로 출력합니다. -->
          <tr v-for="item in tableData" :key="item">
            <td>{{ item.orderId }}</td>
            <td>{{ item.productName }}</td>
            <td>{{ item.ordererName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button @click="insertRgt(0)">db데이터 insert(카페모카)</button>
    <button @click="insertRgt(1)">db데이터 insert(카페테리아)</button><br/>
    <button @click="deleteRgt">db중복데이터 삭제</button><br/>
    <button @click="getAuthCode">google oAuth2.0</button><br/>
    <div>
      구글 사용자 데이터 ==> {{ googleInfo }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { onMounted, getCurrentInstance, ref } from 'vue';

export default {
  name: 'HelloWorld',
  setup() {

    const instance = getCurrentInstance();
    const tableData = ref([])
    const googleInfo = ref({})

    onMounted(() => {
      selectRgt()

      if (instance.proxy.$route.query.code) {
        googleLogin(instance.proxy.$route.query.code)
      }
    })

    // 데이터조회
    const selectRgt = () => {

      axios.get("http://175.195.162.192:8888/rgt/selectRgt")
        .then(({ data }) => {
          console.log("then ==> ", data);

          if (data.code == "0000") {
            tableData.value = data.rdata
            return
          }
          tableData.value = []
        })
        .catch((error) => {
          console.log("catch ==> ", error);
          tableData.value = []
        })
    }

    //데이터 저장
    const insertRgt = (idx) => {
      
      const param = {
          "order_id": idx == 0 ? "0007" : "0012",
          "product_name": idx == 0 ? "카페모카" : "카페테리아",
          "options": "" ,
          "table_no": 3,
          "quantity": 1,
          "order_date": "2023-07-17",
          "order_time": "17:33:31",
          "date_time": "2023-07-17 17:33:31",
          "robot_status": "",
          "dong": "120",
          "ho": "1701",
          "seq": "23071701000074",
          "orderer_name": "홍o동"
      }

      axios.post("http://175.195.162.192:8888/rgt/insertRgt", param)
        .then(({ data }) => {
          console.log("then ==> ", data);

          if (data.code == "0000") {
            selectRgt()
            alert("저장이 완료되었습니다.")
            return
          }

          alert("저장 실패 관리자에게 문의하여주세요.")
        })
        .catch((error) => {
          console.log("catch ==> ", error);
          alert("저장 실패 관리자에게 문의하여주세요.")
        })
        
    }

    // 중복데이터 삭제
    const deleteRgt = () => {

      axios.delete("http://175.195.162.192:8888/rgt/deleteRgt", {})
        .then(({ data }) => {
          console.log("then ==> ", data);

          if (data.code == "0000") {
            selectRgt()
            alert("중복데이터 삭제 및 업데이트가 완료되었습니다.")
            return
          }

          alert("삭제 실패 관리자에게 문의하여주세요.")
        })
        .catch((error) => {
          console.log("catch ==> ", error);
          alert("삭제 실패 관리자에게 문의하여주세요.")
        })
    }

    // 구글인증코드 쿼리 받아오기
    const getAuthCode = () => {
      const clientId = "207832730817-hoifath6cg2p9ugbagm9e3itaj8g7qar.apps.googleusercontent.com"
      const redirectUri = "http://localhost:8080"
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`
      console.log("googleCode ==> ", url);
      let hiddenElement = document.createElement('a');
      hiddenElement.href = url
      hiddenElement.click();
    }

    // 구글로그인
    const googleLogin = (code) => {
      console.log("googleLogin!!!! ==> ", code);

      axios.post(`http://175.195.162.192:8888/rgt/googleLogin`, {code})
        .then(({ data }) => {
          console.log("then ==> ", JSON.parse(JSON.stringify(data)));

          if (data.id) {
            alert("구글 oAuth2.0 access_token을 이용하여 사용자 조회 성공")
          }
          googleInfo.value = data
        })
        .catch((error) => {
          console.log("catch ==> ", error);
        })
    }

    return {
      tableData,
      googleInfo,
      insertRgt,
      deleteRgt,
      getAuthCode,
      googleLogin
    }
  }
}
</script>
