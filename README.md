# NeuroBridge Search Portal

- staging: N/A
- production: [https://portal.neurobridges.org/](https://portal.neurobridges.org/)

This is a [React](https://reactjs.org/) application that was based off of [RENCI/react-starter](https://github.com/RENCI/react-starter).

### 🚧 Development

We're developing with Node v18. Install dependencies with `npm ci`. Run development server on port 8080 with `npm start`.

### 🎁 Production

Build the application for production with `npm run build`. The `dist` directory will contain the files bundled with Webpack. This assets in this bundle are what get copied into the release image, so it's a good idea to ensure that the result of build process is what's expected at this stage, before moving on to build Docker images.

#### Deploying to [Sterling](https://wiki.renci.org/index.php?title=Kubernetes_Cloud/Sterling).

Before doing anything, determine the next release version. Throughout this section, we'll assume the next version is `1.0.4`.

1. **Build.** Build a release image with the following command, executed from the project root.

> To avoid errors on a M1 Mac, build for AMD64 using the following environment variable. [More information](https://stackoverflow.com/questions/65612411/forcing-docker-to-use-linux-amd64-platform-by-default-on-macos/69636473#69636473)
> 
> `export DOCKER_DEFAULT_PLATFORM=linux/amd64`

```bash
docker build -t containers.renci.org/neurobridges/neurobridges-portal:1.0.4 .
```
> Note: The version tag here, `1.0.4`, must match its occurrences elsewhere in these commands.

2. **Test.** Ensure a container can be spun up from your new image
```bash
docker run --rm -p 80:8080 containers.renci.org/neurobridges/neurobridges-portal:1.0.4
```
The container should be running, and we should see the Search Portal in our browser at [http://localhost](http://localhost).

3. **Push.** Push the image to RENCI's image registry.
```bash
docker push containers.renci.org/neurobridges/neurobridges-portal:1.0.4
```
> Note: If not already authenticated, log in with `docker login containers.renci.org`.

4. **Deploy.** Update the value of `image.tag` in the file `kubernetes/values.yaml` to match the image tag used in the Docker commands above. In our running example, the relevant part of `values.yaml` file would need to look like this.

```yaml
image:
  repository: containers.renci.org/neurobridges/neurobridges-portal
  tag: "1.0.4"
```

Deploy the new release with the following command.
```bash
helm upgrade --install neurobridges-portal kubernetes -n neurobridges -f kubernetes/values-prod.yaml
```
