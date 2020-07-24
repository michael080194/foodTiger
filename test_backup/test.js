var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Add default routes,
  });

  // DOM
  var $$ = Dom7;

  var template = $$('script#showTemplate').html();

  // compile it with Template7
  var compiledTemplate = Template7.compile(template);
  // Now we may render our compiled template by passing required context
  var context = {
      people : [
      {
      firstName: 'John',
      lastName: 'Doe'
      },
      {
      firstName: 'Mark',
      lastName: 'Johnson'
      },
      ]
  };
  compiledTemplate.template;
