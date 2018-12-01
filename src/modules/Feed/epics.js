import firebase from "firebase";
import * as c from "./constant";
import { combineEpics } from "redux-observable";
import { ofType } from "redux-observable";
import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

const onPostChanges = handler => action$ =>
  action$.pipe(
    ofType("feed.setupFirebase"),
    mergeMap(action => {
      return new Observable(handler);
    })
  );

const postsManager$ = onPostChanges(observer => {
  const postsRef = firebase.database().ref("posts");
  postsRef.on("child_added", data => {
    observer.next({ type: "feed.addPost", post: data.val(), key: data.key });
  });

  postsRef.on("child_changed", data => {
    observer.next({ type: "feed.changePost", post: data.val(), key: data.key });
  });

  postsRef.on("child_removed", data => {
    observer.next({ type: "feed.removePost", post: data.val(), key: data.key });
  });

  postsRef.on("child_moved", data => {
    observer.next({ type: "feed.movePost", post: data.val(), key: data.key });
  });
});

const createPost$ = action$ =>
  action$.pipe(
    ofType(c.CREATE_POST),
    mergeMap(
      action =>
        new Observable(observer => {
          const postsRef = firebase.database().ref("posts");
          postsRef
            .push(
              {
                content: action.content
              },
              error => {
                if (error) observer.error();
              }
            )
            .then(ref => {
              observer.complete();
            });
        })
    )
  );

export default combineEpics(postsManager$, createPost$);
