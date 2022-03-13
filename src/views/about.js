import { Container, Typography } from '@mui/material'

export const AboutView = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center">
        About
      </Typography>

      <br />
      
      <Typography paragraph>
        Sed ut consectetur ad minim officia consequat id ad quis voluptate commodo in do.
        Sit anim amet aute proident aliqua anim consectetur occaecat dolore non commodo qui aliquip nostrud laborum.
        Incididunt quis non sunt veniam nisi sint fugiat consequat exercitation.
      </Typography>

      <Typography paragraph>
        Et do cupidatat sint veniam culpa eu ex ex aliquip.
        Dolor et aute est id magna sunt veniam proident.
        Nisi nostrud cillum dolor dolor in nisi veniam officia irure nisi commodo.
        Pariatur deserunt adipisicing consectetur minim laboris ex ut ut in.
        Culpa in sint nulla nisi dolor aute amet cupidatat ut.
        Esse ut consequat pariatur reprehenderit duis et ullamco commodo reprehenderit.
      </Typography>
    </Container>
  )
}
