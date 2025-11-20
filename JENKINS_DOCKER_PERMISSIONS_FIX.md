# Fix: Jenkins Docker Permission Denied Error

## 🔴 Error Message
```
ERROR: permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock
```

## 🎯 Solution: Add Jenkins User to Docker Group

The Jenkins user needs permission to access the Docker daemon socket. Here's how to fix it:

### Step 1: Check Current Jenkins User

```bash
# Find out which user Jenkins is running as
ps aux | grep jenkins
# Or check the Jenkins process
sudo systemctl status jenkins
```

Typically, Jenkins runs as the `jenkins` user.

### Step 2: Add Jenkins User to Docker Group

```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Verify the user was added
groups jenkins
# Should show: jenkins : jenkins docker
```

### Step 3: Restart Jenkins

```bash
# Restart Jenkins service
sudo systemctl restart jenkins

# Verify Jenkins is running
sudo systemctl status jenkins
```

### Step 4: Verify Docker Access

You can test if Jenkins can access Docker by running a test command as the jenkins user:

```bash
# Test Docker access as jenkins user
sudo -u jenkins docker ps
```

If this works without errors, the permission issue is fixed!

---

## 🔧 Alternative Solutions

### Option 1: Use Docker Socket Permissions (Less Secure)

If you can't add the user to the docker group, you can change socket permissions (not recommended for production):

```bash
# Change Docker socket permissions (temporary fix)
sudo chmod 666 /var/run/docker.sock
```

**⚠️ Warning**: This is less secure as it allows any user to access Docker.

### Option 2: Use Docker-in-Docker (DinD)

If you're running Jenkins in a container, you might need to mount the Docker socket:

```yaml
# docker-compose.yml example
services:
  jenkins:
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

### Option 3: Use Jenkins Docker Agent

Configure Jenkins to use a Docker agent that has Docker access:

1. Go to **Manage Jenkins** → **Manage Nodes and Clouds**
2. Configure a Docker agent with proper permissions

---

## ✅ Verification

After applying the fix, run your Jenkins pipeline again. The Docker build stage should now succeed.

### Expected Output

```
[Pipeline] stage
[Pipeline] { (Build Docker Image)
[Pipeline] echo
🐳 Building Docker image...
[Pipeline] script
[Pipeline] {
[Pipeline] sh
+ docker build -t sddoon/cropdarpan-frontend:3 .
Sending build context to Docker daemon...
Step 1/10 : FROM node:20-alpine AS build
...
Successfully built abc123def456
Successfully tagged sddoon/cropdarpan-frontend:3
```

---

## 🐛 Troubleshooting

### Issue: `usermod: user 'jenkins' does not exist`

**Solution**: Find the actual Jenkins user:
```bash
# Check Jenkins configuration
sudo cat /etc/default/jenkins | grep JENKINS_USER
# Or
ps aux | grep jenkins
```

Then use the correct username in the `usermod` command.

### Issue: Still getting permission denied after adding to group

**Solution**: 
1. Make sure you restarted Jenkins: `sudo systemctl restart jenkins`
2. Verify the user is in the group: `groups jenkins`
3. Check Docker socket permissions: `ls -la /var/run/docker.sock`
4. Try logging out and back in if you're testing manually

### Issue: Jenkins is running in a container

**Solution**: 
1. Mount the Docker socket when starting the Jenkins container
2. Or add the container user to the docker group inside the container
3. Or use Docker-in-Docker (DinD) approach

---

## 📋 Quick Reference

```bash
# Add jenkins to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins

# Verify
sudo -u jenkins docker ps
```

---

## 🔒 Security Note

Adding the Jenkins user to the docker group gives it root-equivalent access (since Docker can run containers with root privileges). This is standard practice for CI/CD systems, but ensure:

1. Jenkins is properly secured (authentication, authorization)
2. Only trusted users can create/modify Jenkins jobs
3. Regular security updates are applied
4. Consider using Jenkins security best practices

---

**After applying this fix, your Docker build stage should work!** 🎉

