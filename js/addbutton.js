(function(){
$('#contchp1').markdown({
  additionalButtons: [
    [{
          name: "groupCustom",
          data: [{
            name: "cmdBeer",
            toggle: true, // this param only take effect if you load bootstrap.js
            title: "Beer",
            icon: "glyphicon glyphicon-glass",
            callback: function(e){
              // Replace selection with some drinks
              var chunk, cursor,
                  selected = e.getSelection(), content = e.getContent(),
                  drinks = ["Heinekken", "Budweiser",
                            "Iron City", "Amstel Light",
                            "Red Stripe", "Smithwicks",
                            "Westvleteren", "Sierra Nevada",
                            "Guinness", "Corona", "Calsberg"],
                  index = Math.floor((Math.random()*10)+1)


              // Give random drink
              chunk = drinks[index]

              // transform selection and set the cursor into chunked text
              e.replaceSelection(chunk)
              cursor = selected.start

              // Set the cursor
              e.setSelection(cursor,cursor+chunk.length)
            }
          }]
    }]
  ]
});
})();