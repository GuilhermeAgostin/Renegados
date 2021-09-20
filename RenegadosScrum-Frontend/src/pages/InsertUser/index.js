import { Button } from '@material-ui/core'
import { Slide } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { DefaultStyles } from '../../constants/DefaultStyles'
import { Metrics } from '../../constants/Metrics'
import { DrawerComponent } from '../../drawer/DrawerComponent'
import { useMobileListener } from '../../utils/isMobile'
import { Setup } from './Config/Setup'

export default function InsertUser(props) {
  const UseMobileInfo = useMobileListener()
  const steps = Setup.Steps
  const InputArray = Setup.InputArray

  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  function isStepOptional(step) {
    return step === 1
  }

  function isStepSkipped(step) {
    return skipped.has(step)
  }

  function handleReset() {
    setActiveStep(0)
  }

  function handleNext() {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  function handleSkip() {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  return (
    <DrawerComponent
      history={props.history}
      active={0}
      children={
        <div style={{ ...DefaultStyles.Flex, backgroundColor: Colors.White }}>

          <CssBaseline />

          <div
            style={
              UseMobileInfo
                ? { ...DefaultStyles.Flex, paddingTop: Metrics.MinMargin }
                : { ...DefaultStyles.FlexRow, padding: Metrics.MinMargin }
            }>
            <div style={{ flex: 0 }}>
              <Stepper

                orientation={UseMobileInfo ? 'horizontal' : 'vertical'}
                activeStep={activeStep}>
                {
                  steps.map((label, index) => {
                    const stepProps = {}
                    const labelProps = {}
                    if (isStepSkipped(index)) {
                      stepProps.completed = false
                    }
                    return (
                      <Step key={label} {...stepProps} >
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    )
                  })
                }
              </Stepper>
            </div>

            <Divider
              orientation="vertical"
              flexItem />

            {
              activeStep === 0 &&
              <div style={styles.NewUserContainer}>
                <Typography style={DefaultStyles.TitleText}>{Setup.Strings.NEW_USER}</Typography>

                <Typography style={{...DefaultStyles.MinTitleText, marginTop:40}}>{Setup.Strings.SUB_TITLE_TEXT}</Typography>
                <div style={!UseMobileInfo ? { ...DefaultStyles.FlexRow, flexWrap: 'wrap', flex: 0 } : {}}>
                  {
                    InputArray.map((item, index) =>
                      <>
                        <Slide
                          direction="down"
                          in={true}
                          mountOnEnter
                          unmountOnExit
                          style={{ paddingTop: Metrics.MinMargin }}
                          key={item.key}
                          timeout={{ appear: 1500, enter: 1500, exit: 500 }}>

                          <div style={
                            index > 0 && UseMobileInfo
                              ? { paddingTop: Metrics.DefaultMargin }
                              : !UseMobileInfo
                                ? { marginRight: Metrics.MinMargin, flex: 1 }
                                : {}
                          }>
                            <TextField
                              variant={item.variant}
                              size={item.size}
                              fullWidth={item.fullWidth}
                              label={item.label}
                              name={item.name}
                              autoComplete={item.autoComplete}
                              InputProps={item.InputProps}
                            />

                          </div>
                        </Slide>

                        {
                          index === 2 && <div style={{ flexBasis: '100%', height: 0 }}></div>
                        }

                      </>
                    )
                  }
                </div>
              </div>
            }
          </div>


          <div style={{
            ...DefaultStyles.FlexRow
            , borderTop: '.5px solid #fefefe'
            , justifyContent: 'space-around'
            , flexWrap: 'wrap-reverse'
            , maxHeight: UseMobileInfo ? 20 : 100
            , alignItems: 'center'
            , position: 'fixed'
            , bottom: 0
            , width: '100%'
          }}>


            <div style={{ padding: Metrics.MinMargin, flex: 0.3, }}>
              <Button
                color="primary">
                {Setup.Strings.CANCEL}
              </Button>
            </div>
            <div style={{ ...DefaultStyles.FlexRow, flex: .3, minWidth: '50%', backgroundColor: 'transparent', marginLeft: 'auto', justifyContent: 'flex-end', paddingRight: UseMobileInfo ? 10 : Metrics.MaxMargin }}>
              <Button
                onClick={handleBack}
                style={{ marginRight: 15 }}
                variant="outlined"
                color="primary" >
                {Setup.Strings.OLD_STEP}
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                color="primary" >
                {Setup.Strings.NEXT_STEP}
              </Button>
            </div>
          </div>

        </div>
      } />
  )
}



const styles = {
  NewUserContainer: {
    ...DefaultStyles.Flex
    , flexDirection: 'column'
    , paddingLeft: Metrics.MinMargin
    , paddingRight: Metrics.MinMargin
  }
}