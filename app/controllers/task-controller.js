const Task = require('../db/models/task');

class TaskController {

  async showTasks(req, res) {
    // pobierz wszystkie taski i wyświetl na widoku
    const tasks = await Task.find({})
    res.render('pages/tasks/index', {tasks});
  }

  showCreateForm(req, res) {
    // wyświetl formularz nowego taska
    res.render('pages/tasks/create');
  }

  async create(req, res) {
    // przygotuj nowy task
    const task = new Task({
      title: req.body.name,
      description: req.body.description,

    })
    try {
      await task.save()
      res.redirect('/' );
    } catch (e) {
      // jeśli są błędy, wyświetl ja na widoku
      console.log("blad")
      console.log(req.body)
      res.render('pages/tasks/create', {
				errors: e.errors,
				form: req.body,
			});
    }
  }

  async showEditForm(req, res) {
    // pobierz task i wyświetl formularz edycji

    // mongoose posiada metodę .findById
    // Przykła: task = await Task.findById('60fec8c43501d21b309befbd')
    // https://mongoosejs.com/docs/api.html#model_Model.findById

    const {id} = req.params
    const task = await Task.findById(id)

    res.render('pages/tasks/edit', {form: task});
  }

  async edit(req, res) {
    // pobierz task
    const {id} = req.params
    const task = await Task.findById(id)
    // zaktualizuj dane
    task.title = req.body.name
    task.description = req.body.description

    try {
      // zapisz i przekieruj na stronę główną
      await task.save()
      res.redirect('/');
    } catch (e) {
      // jeśli są błędy, wyświetl ja na widoku
      res.render('pages/tasks/edit', 
      {errors: e.errors,
      form: req.body,}
      );
    }
  }

  async delete(req, res) {
    const { id } = req.params
    try {
      // usuń task i przekieruj na stronę główną
      await Task.deleteOne({_id: id})
      res.redirect('/');
    } catch (e) {
      console.log("blad podczas usuwania")
      // opcjonalnie obsłuż błąd
    }
  }

  async toggleDone(req, res) {
    // pobierz task
    // zmień wartość "done" taska (na odwrotną, czyli z 1 na 0, lub z 0 na 1) 
    // oraz przekieruj na stronę główną
    const { id } = req.params
    const task = await Task.findOne({_id : id})
    task.done = task.done ? 0 : 1;
    task.title = task.title
    task.description = task.description
    console.log(task)

    try {
       await task.save()
       res.redirect('/')
        }catch (e)
          {
           console.log("error")
          }
  }
  
}

module.exports = new TaskController();