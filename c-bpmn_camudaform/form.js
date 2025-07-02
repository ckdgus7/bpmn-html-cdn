function renderFormLogic() {
  // 필요 시 초기화 코드 추가
}

const submitForm = function submitForm() {
  const role = document.getElementById('role').value;
  const error = document.getElementById('form-error');

  if (role === 'admin') {
    error.innerText = '관리자는 이 작업을 수행할 수 없습니다.';
    return;
  }

  error.innerText = '';
  alert(`폼 제출 성공: role = ${role}`);
}
