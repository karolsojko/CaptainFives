# Captain Fives

Slack bot to keep track of /fives inside X-Team's channels.

[![Deploy to Docker Cloud](https://files.cloud.docker.com/images/deploy-to-dockercloud.svg)](https://cloud.docker.com/stack/deploy/)

![Captain Fives](/assets/captainOnSlack.png)

### Install

```
docker-compose run web npm install
```

### Configure

Edit the config file `app/config.json`
Note: the token has to authorize successfully against Slack.

### Run

```
docker-compose up -d
```

To see logs type:
```
docker-compose logs
```

### How it works

When added to a channel, the Captain silently keeps track of every /five given to users.
To retrieve the /five count for the users just mention @captainfives along with any user(s) you want to retrieve data for.

![Captain in Action](/assets/captainInAction.png)

### TODO / Ideas

- Display Top 5 and Top 10 users.
- Set /fives milestones and automatically congratulate users when their /fives count pass them.
- Create rewards for each milestone.
- Expose data over API.
