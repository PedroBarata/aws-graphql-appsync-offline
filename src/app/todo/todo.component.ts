import { Component, OnInit } from '@angular/core';
import { AppsyncService } from '../appsync.service';
import { createTodo } from '../../graphql/mutations';
import { listTodos } from '../../graphql/queries';

import gql from 'graphql-tag';
import { buildMutation } from 'aws-appsync';
import { createTodoInput } from '../../graphql/inputs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  public allTodos = [];

  constructor(private appsync: AppsyncService) { }

  ngOnInit() {
    this.appsync.hc().then(client => {
      const observable = client.watchQuery({
        query: gql(listTodos),
        fetchPolicy: 'cache-and-network'
      });
      observable.subscribe(({ data }) => {
        this.allTodos = data.listTodos.items;
      });
    });
  }

  async createTodo(todoName) {
    
    if (todoName.value.length) {
      /* Espera pelo client */
      const client = await this.appsync.hc();

      /* Mutation para salvar */
      const result = await client.mutate(buildMutation(
        client,
        gql(createTodo),
        {
          inputType: gql(createTodoInput),
          variables: {
            input: {
              name: todoName.value
            }
          }
        },
        _variables => [gql(listTodos)],
        "Todo"
      ));
        console.log(result);
        
      this.allTodos.push(result.data.createTodo);
      todoName.value = null;
    }
  }
}
