import { Box, Button, ButtonGroup,Flex,HStack,IconButton,Input,SkeletonText,Text} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import SVGAnimation from './SVGAnimation'
import './App.css'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState , useEffect } from 'react'



const center = { lat: 48.8584, lng: 2.2945 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:"AIzaSyDvPLKp3jbXqZnybV92qe2wbJ4DWptExM4" ,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  const [animatePerson, setAnimatePerson] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef(null);
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  
  
  

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    setAnimatePerson(true);
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }
 
  const onAnimationEnd = () => {
    setAnimatePerson(false);
    setAnimationProgress(0);
  };

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse}>
               {directionsResponse.routes[0].legs[0].steps.map((step, index, steps) => (
                <SVGAnimation
                  key={step.start_location.lat() + step.start_location.lng()}
                  onAnimationEnd={onAnimationEnd}
                  origin={step.start_location}
                  destination={step.end_location}
                  progress={animationProgress}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'blue', // Set the color of the circle
                    position: 'absolute',
                    transition: 'transform 1s ease-in-out',
                    transform: `translate(${animatePerson ? (index / steps.length) * 100 : 0}%, 0)`,
                    left: '-100px'
                  }}
                  className={`moving-object ${animatePerson ? 'animate' : ''}`}
                />
              ))}
            </DirectionsRenderer>
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
