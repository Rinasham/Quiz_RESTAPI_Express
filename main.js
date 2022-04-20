const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))


//------------ DB -------------------

//--------DB settings------------------
mongoose.connect('mongodb://localhost:27017/QuizDB',{useNewUrlParser: true})

const quizSchema = new mongoose.Schema({
  id: Number,
  question: String,
  description: String,
  answers: {
    answer_a: String,
    answer_b: String,
    answer_c: String,
    answer_d: String,
    answer_e: String,
    answer_f: String
  },
  multiple_correct_answers: String,
  correct_answers: {
  answer_a_correct: String,
  answer_b_correct: String,
  answer_c_correct: String,
  answer_d_correct: String,
  answer_e_correct: String,
  answer_f_correct: String
  },
  correct_answer: String,
  explanation: String,
  tip: String,
  tags: [
  {name: String}
  ],
  category: String,
  difficulty: String,
})

const Quiz = mongoose.model('Quiz', quizSchema)

//--------------------------------------

app.route('/articles')
  .get(function(req, res){
    Article.find({}, function(err, foundArticles){
      if(!err){
        res.send(foundArticles)
      } else {
        res.send(err)
      }
    })
  })

  .post(function(req, res){
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })
    article.save(function(err,){
      if(!err){
        res.send('Successfullt added a new article.')
      } else {
        res.send(err)
      }
    })
  })

  .delete(function(req, res){
    Article.deleteMany({}, function(err){
      if(!err){
        res.send('Successfully deleted all articles.')
      } else {
        res.send(err)
      }
    })
  })

//---------------------------------------------------------

app.route('/articles/:articleTitle')
.get(function(req, res){
  Article.findOne(
    {title: req.params.articleTitle},
    function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle)
      } else {
        res.send('No articles matching that title was found.')
      }
    }
  )
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle}, // search for the data do you want to update
    {title:req.body.title,
    content: req.body.content}, // data you want to overwrite with
    function(err){
      if(!err){
        res.send('Successfullt update article.')
      }
    }

  )
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set : req.body},
    function(err){
      if(!err){
        res.send('Successfully updated article.')
      }
    }
  )
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send('Successfully deleted the corresponding article.')
      }
    }
  )
})

//-------------Requests targeting a specific article-----------------------


app.get("/quiz/:category", function(req, res){
  const requestedCategory = req.params.category;
  // switch (requestedCategory){
  //   case linux:
  //     requestedCategory = 'Linux'
  //     break;
  //   case Bash:
  //     requestedCategory = 'Bash'
  //     break;
  //   case docker:
  //     requestedCategory = 'Docker'
  //     break;
  //   case sql:
  //     requestedCategory = 'SQL'
  //     break;
  // }
  Quiz.findOne({category: {$regex:requestedCategory, $options: '$i'}},function(err, foundQuiz){
    if(!err){
      console.log(foundQuiz);
      res.send(foundQuiz)
      } else {
        res.send(err)
      }
  })
})


//----------------------------------------------------

app.listen(3000, function(){
  console.log('Server started on port 3000.')
})