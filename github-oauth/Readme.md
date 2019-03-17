Github OAuth lambda's
=====================

Deploys two lambda's to [Now][now]:

  * `/login` will redirect to the Github server allowing a user to login.
  * `/callback` will be called after the user has logged in. It redirects to a
    predefined url, adding the Github access token to the url fragment.

[now]: https://zeit.co/now
