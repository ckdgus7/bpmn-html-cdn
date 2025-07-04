function saveXMLHandler(bpmnModeler, fileName) {
  bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }).catch(err => {
    console.error('❌ XML 저장 실패:', err);
  });
}
