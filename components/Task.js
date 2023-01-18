import React, { useState } from "react";
import {
  View,
  Text,
  Heading,
  Pressable,
  Icon,
} from "native-base";
import { StyleSheet } from "react-native";
import { UPDATE_TASK, PUSH_TASK } from "./helpers/mutations";
import { useMutation } from "@apollo/client";
import { Entypo, AntDesign } from '@expo/vector-icons';
import { useDispatch } from "react-redux";
import { pushTask, updateTask } from "../redux/slices/storageSlice";
import { getTimeOfDay } from "./helpers/dateHelperFunc";

const LazyLoadModal = React.lazy(() => import('./TaskModal'))
const LazyLoadPushModal = React.lazy(() => import('./PushComponent'))


const taskCategories = {
  1: 'Errand',
  2: 'Academic',
  3: 'Work',
  4: 'Social',
  5: 'Spiritual',
  6: 'Other'
}

const taskCategoryColors = {
  1: '#FF9900',
  2: '#0B486B',
  3: '#FE4365',
  4: '#630947',
  5: '#A8DBA8',
  6: 'black'
}

const Task = ({ prevDay, date, taskId, title, description, startTime, endTime, completed, category, refetch }) => {
  const [openTask, toggleOpenTask] = useState(false);
  const [pushTaskModal, openPushTaskModal] = useState(false);
  const dispatch = useDispatch()
  const [updateTaskMutationNoRefetch] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      dispatch(updateTask(data.updateTask))
    },
    onError: (err) => {
      console.log("Error Updating Task: ", err)
    }
  });

  const [updateTaskMutationRefetch] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      dispatch(updateTask(data.updateTask))
      refetch();
    },
    onError: (err) => {
      console.log("Error Updating Task: ", err)
    }
  });


  const [pushTaskMutation] = useMutation(PUSH_TASK, {
    onCompleted: (data) => {
      dispatch(pushTask(data.pushTask))
    },
    onError: (err) => {
      console.log("Error Pushing Task: ", err)
    }
  });

  const pushTaskHandler = (selectedValue) => {
    let timeToAdd = selectedValue * 3600000
    let newStartTime = Number(startTime) + timeToAdd
    let newEndTime = Number(endTime) + timeToAdd
    pushTaskMutation({ variables: { id: Number(taskId), newStartTime: newStartTime.toString(), newEndTime: newEndTime.toString(), newTimeOfDay: getTimeOfDay(newStartTime.toString()) } })

    openPushTaskModal(false)
  }


  return (
    <Pressable
      onPress={() => toggleOpenTask(true)}
    >
      <View style={styles.taskContainer} key={title}>
        <View style={styles.taskContainerInnerWrapper}>
          <View display="flex" flexDirection="column" width="55%">
            <Heading style={styles.taskHeading}>{title}</Heading>
            <View
              borderColor={taskCategoryColors[category]}
              borderWidth={1}
              style={styles.categoryContainer}
            >
              <Text
                fontFamily="FamiljenGrotesk"
                color={taskCategoryColors[category]}
              >
                {taskCategories[category]}
              </Text>
            </View>
          </View>
          {/* Push Task Button */}
          {completed === true || Date.now() > (Number(endTime) + 86400000) ? '' : <Pressable onPress={() => openPushTaskModal(true)} style={{ borderColor: "black", borderWidth: 0, position: 'absolute', right: 115 }}>
            <Icon as={AntDesign} name="rightcircle" size={6} color="amber.500" style={{ position: 'relative' }} />
          </Pressable>}

          {pushTaskModal && <LazyLoadPushModal pushTaskHandler={pushTaskHandler} pushTaskModal={pushTaskModal} openPushTaskModal={openPushTaskModal} />}

          <View style={styles.taskContainerTimeContainer}>
            <Text style={{ ...styles.timeContainerText, ...styles.timeText }}>{new Date(Number(startTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            <Text style={styles.timeContainerText}>to</Text>
            <Text style={{ ...styles.timeContainerText, ...styles.timeText }}>{new Date(Number(endTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </View>

          {/* Right Icon At The End Of The Component */}
          <View style={styles.swipeRightIcon}>
            <Icon as={Entypo} name="chevron-small-right" size={5} />
          </View>
        </View>
        {openTask &&
          <LazyLoadModal
            taskCategory={category} prevDay={prevDay}
            taskDate={date} taskDescription={description}
            openTask={openTask} toggleOpenTask={toggleOpenTask} taskTitle={title}
            taskStartTime={startTime} taskEndTime={endTime}
            taskId={taskId} completed={completed}
            updateTaskMutationNoRefetch={updateTaskMutationNoRefetch} updateTaskMutationRefetch={updateTaskMutationRefetch}
          />
        }
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ceddf5",
    borderBottomWidth: 1,
    topBorderWidth: 1,
    padding: 10,
    height: 90,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    backgroundColor: "white",
    zIndex: 10,
  },
  taskContainerInnerWrapper: {
    display: 'flex',
    width: '80%',
    borderColor: 'red',
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  categoryContainer: {
    maxWidth: '55%',
    maxHeight: 30,
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    display: 'flex',
    marginTop: 2
  },
  taskContainerTimeContainer: {
    display: "flex",
    flexDirection: "column",
    fontSize: 17,
    marginTop: 2,
    gap: 20,
    height: '110%',
    width: '25%',
    alignItems: "center",
    justifyItems: 'center',
    justifyContent: "space-around",
    borderColor: "black",
    borderWidth: 0,
    marginRight: 5
  },
  timeContainerText: {
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'FamiljenBold',
    fontWeight: 'bold'
  },
  timeText: {
    color: '#0B486B',
    borderColor: 'black',
    borderWidth: 0,
    padding: 3,
    borderRadius: '2%',

  },
  taskHeading: {
    fontSize: 18,
    fontFamily: "FamiljenGrotesk",
    // textDecorationLine: "underline"
  },
  swipeRightIcon: {
    position: "absolute",
    right: -18.5
  }
});

export default React.memo(Task);