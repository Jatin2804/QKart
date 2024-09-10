# Curl cammands

# Register user with username "crio.do" and password "learnbydoing"

curl -X POST -H "Content-Type: application/json" -d '{"username":"crio.do","password":"learnbydoing"}' http://52.66.220.16:8082/api/v1/auth/register

# Register user with username "crio.do" and password "learnbydoing"

curl -X POST -H "Content-Type: application/json" -d '{"username":"crio.do","password":"learnbydoing"}' http://52.66.220.16:8082/api/v1/auth/login
