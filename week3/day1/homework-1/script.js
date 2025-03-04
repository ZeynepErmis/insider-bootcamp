$(document).ready(function () {
  // Initial student data array
  let studentData = [
    { name: "Zeynep", lecture: "Software Development", lectureHall: "E.B.11" },
    { name: "Ali", lecture: "Database Systems", lectureHall: "W.B.25" },
    { name: "Ayşe", lecture: "Web Development", lectureHall: "E.B.20" },
  ];

  // Function to display student data in the table
  function displayStudents() {
    $("#studentTable").empty(); // Clear the table before adding new data
    studentData.forEach((student, index) => {
      $("#studentTable").append(`
        <tr data-index="${index}">
          <td>${student.name}</td>
          <td>${student.lecture}</td>
          <td>${student.lectureHall}</td>
          <td class="delete-btn">❌</td> <!-- Delete button for each row -->
        </tr>
      `);
    });
  }

  displayStudents();

  // Event listener for the "Add Student" button
  $(".addStudent").click(function () {
    let name = $("#studentName").val().trim();
    let lecture = $("#lecture").val().trim();
    let lectureHall = $("#lectureHall").val().trim();

    // Check if all input fields are filled
    if (name && lecture && lectureHall) {
      studentData.push({ name, lecture, lectureHall }); // Add new student data
      displayStudents(); 
      $("#studentName, #lecture, #lectureHall").val(""); 
    } else {
      alert("Please fill out all form elements"); 
    }
  });

  // Event listener for delete button click
  $(document).on("click", ".delete-btn", function () {
    let index = $(this).closest("tr").data("index"); // Get the index of the row
    studentData.splice(index, 1); // Remove the student from the array
    displayStudents(); 
  });

  // Event listener to highlight a selected row
  $(document).on("click", "#studentTable tr", function () {
    $(this).toggleClass("selected-row"); 
  });
});
