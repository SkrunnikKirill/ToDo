	var $formAddTask = $("#formAddTask"),
		 $modalAddTask = $("#modalAddTask"),
		 $taskList = $("#taskList"),
		 // Редактирование задачи
		 $modalEditTask = $("#modalEditTask"),
		 $formEditTask = $("#formEditTask"),
		 $modalDeleteTask = $("#modalDeleteTask"),
		 $deleteTaskBtn = $("#deleteTaskBtn"),
		 $clearLocale = $("#clearLocale")
		 counter1 = 0,
		 counter2 = 0,
		 counter3 = 0;
		 // console.log($formAddTask.length);
		 $formAddTask.on("submit", function(event){
		  event.preventDefault();

	 // Сохраняем значения
	  // Отображение в консоли
    var task = {
	   title: $("[name=title]", this).val(),
	   status: (function(){
	   	if($('option').attr("value") == "1") {
	   		return 1;
	   	}
	   })()// 2 - inprogress, 3 - done
	  };

	  // Если пустое поле заголовка задачи, то выполнение функции прерывается
	  if(!task.title) {
	   $("[name=title]",this).parent().addClass("has-error");
	   return;
	  };


	  // Уникальные данные, время уникально в каждый момент времени
	  var id = new Date().getTime();
	  // Записываем данные в локальное хранилище
		  localStorage.setItem(id, JSON.stringify(task) );
		  // Закрывает модально окно
		  $modalAddTask.modal("hide");

		  createTask(task, id);
		  // Добавляет начальное значение
		  this.reset();

	});
	// Добавляем задачу на страницу
	 function createTask(task, id) {
		  console.log(task.status);
		  // Добавляем сам крестик,
		  var $delete = $("<button>").addClass("btn btn-danger delete-task pull-right").append("<i class='glyphicon glyphicon-remove'></i>");
		  var $edit = $("<button>").addClass("btn btn-warning edit-task pull-right").append("<i class='glyphicon glyphicon-pencil'></i>");
		  
		  $("<li>")
		  .addClass("list-group-item")
		  .text(task.title)
		  .attr("data-key", id)
		  .appendTo('[data-status="'+task.status +'"]' ,$taskList)
		  // добавляем крестик
		  .append($delete)
		  .append($edit);

	// Counter
	  

		  if (key in localStorage && task.status == "1"){
		   counter1 += 1;
		   $(".one").text(counter1);
		  }
		  if (key in localStorage && task.status == "2"){
		   counter2 += 1;
		   $(".two").text(counter2);
		  }
		  if (key in localStorage && task.status == "3"){
		   counter3 += 1;
		   $(".tree").text(counter3);
		  }
	 }


	// перебираем значения
		 for ( var key in localStorage) {
		  if(localStorage.hasOwnProperty(key)){
		   createTask( JSON.parse(localStorage[key]), key );
		  }
		 }

	// Добавляем фокус на вводе задачи
		$modalAddTask.on("shown.bs.modal", function(){
		 $("[name=title]", this).focus();
		})

		// Удаляем фокус при повторном открытии модального окна
		$modalAddTask.on("hidden.bs.modal", function(){
		 $("[name=title]", this).parent().removeClass("has-error");
		 // Очишается при закрытии окна, и при повторном открытии не появляется
		 $formAddTask[0].reset();
		})
		// Удаление
		$("body").on("click", ".delete-task", function(){
		 $modalDeleteTask.attr("data-key", $(this).parent().attr("data-key"))
		 $modalDeleteTask.modal("show");

		})
	// Удаление на красную кнопку
		$deleteTaskBtn.on("click", function(){
		 var key = $modalDeleteTask.attr("data-key");
		 $modalDeleteTask.removeAttr("data-key");
		 localStorage.removeItem(key);
		 $('[data-key="' + key + '"]').remove();
		 $modalDeleteTask.modal("hide");
		})
	// Очистка локального хранилища, и удаление всех элементов со страницы
		$clearLocale.on("click", function(){
		 $(".list-group-item").detach();
		 localStorage.clear();
		 $(".one, .two, .tree").text("0");
		 return;
		})

	//Редактирование
		$("body").on("click", ".edit-task", function() {
		 $modalEditTask.modal("show");

		 var key = $(this).parent().attr("data-key");

		 var task = JSON.parse(localStorage.getItem(key));

		 $('[name="key"]', $formEditTask).val(key);
		 for(var key in task){
		  $('[name="' + key + '"]', $formEditTask).val( task[key]);
		 }
		});

		// Изменить значение задачи
		$formEditTask.on("submit", function(event){
		 event.preventDefault();

		 var task = {
		  title: $("[name=title]", this).val(),
		  status: $("[name=status]", this).val()
		 };

		 var key = $("[name=key]").val();
		 localStorage.setItem(key, JSON.stringify(task));
		 $modalEditTask.modal("hide");
		 $('[ data-key="' + key + '"]').remove();
		 createTask(task, key);

		})