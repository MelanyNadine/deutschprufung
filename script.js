let CSVDATA = [["NGO Name", "Website URL", "Trustworthy"]];
let JSONDATA = {};
let PDFDATA = [];

function processData() {
  preProcessPDF();
}

const preProcessJSON = () => {

  if (Object.entries(JSONDATA).length) {
    JSONDATA = {};
  };

  [...rows].forEach(row => {
    let name = row.firstElementChild.innerText;
    let websiteUrl = row.querySelector("a").getAttribute("href");
    let isTrustworthy = row.querySelector("input[type='checkbox']").checked ? 'YES': 'NO';
    let jsonRow = {"name":name, "website_url": websiteUrl, "is_trustworthy": isTrustworthy};
    JSONDATA = { ...JSONDATA, ...jsonRow };
    console.log(JSONDATA);
  });

  return JSONDATA;
}

const preProcessCSV = () => {
  if (CSVDATA) {
    CSVDATA = [["NGO Name", "Website URL", "Trustworthy"]];
  }

  [...rows].forEach(row => {
    let name = row.firstElementChild.innerText;
    let websiteUrl = row.querySelector("a").getAttribute("href");
    let isTrustworthy = row.querySelector("input[type='checkbox']").checked ? 'YES': 'NO';
    let csvRow = [name, websiteUrl, isTrustworthy];
    CSVDATA.push(csvRow);
  });

  return CSVDATA;
}

const preProcessPDF = () => {
  if (PDFDATA) {
    PDFDATA = [];
  };

  let ans;
  let question;

  [...answers].forEach((answer, index)=> {

    if (answer.type== 'radio'){
    if (answer.checked){
      ans = answer.name;
      question = answer.value;
    }else{
      ans = null;
      question = null;
    }
    }else{
      ans = answer.value;
      question = labels[index].innerText == '' ? answer.placeholder : labels[index].innerText;
    }
        
    if(ans){
    PDFDATA.push(`${question} ${ans}`);
    }
  });
}

function generateJSON() {

  // Convert JSON object to string
  var jsonString = JSON.stringify(JSONDATA, null, 2);

  // Create a blob with the JSON string
  var blob = new Blob([jsonString], {type: "application/json"});

  // Create a download link
  var downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "african_ngos_trustworthiness.json";
  downloadLink.click();
}

function generateCSV() {

  // Convert data array to CSV string
  var csvString = "";

  CSVDATA.forEach(row => {
    csvString += row.join(",") + "\n";
  });

  // Create a blob with the CSV string
  var blob = new Blob([csvString], {type: "text/csv"});

  // Create a download link
  var downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "african_ngos_trustworthiness.csv";
  downloadLink.click();
}

function generatePDF() {
  // Create a new jsPDF instance
  let doc = new jsPDF();
  let studentName = document.getElementById("studentName").value;
  let unit = document.getElementById("unit").innerText ?? '';
  studentName = studentName.replace(" ", "_");

  // Sample content to be added in the PDF
  let content = PDFDATA;
  let limit = 50;
  let content1;
  let content2;

  doc.setFontSize(10);

  // Add content to the PDF document
    
  if (PDFDATA.length>limit){
    content1 = content.slice(0, limit);
    content2 = content.slice(limit, content.length-1);
    doc.text(content1, 10, 10);
    doc.addPage();
    doc.text(content2,10,10);
  }else{
    doc.text(content,10,10);
  }

  // Save the PDF document
  doc.save(`test${unit}_${studentName}.pdf`);

}

var answers = document.querySelectorAll('input:not([id="studentName"])');
var labels = document.querySelectorAll("label");

var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();

const timer = setTimeout(disableSubmit, 3600000);

function disableSubmit() {
  document.getElementById("btn-submit").disabled = true;
}

processData();