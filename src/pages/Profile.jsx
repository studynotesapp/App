import React, { useState, useEffect } from 'react';

import axios from 'axios';
import {
    MortarBoardIcon,
    LocationIcon,
    PeopleIcon,
} from '@primer/octicons-react';

import Navbar from '../components/Auth/Navbar';
import Content from '../components/Common/Content';
import Name from '../components/Profile/Name';
import Details from '../components/Profile/Details';
import DetailRow from '../components/Profile/DetailRow';
import Title from '../components/Common/Title';
import InfoMessage from '../components/Common/InfoMessage';
import UserAvatar from '../components/Profile/UserAvatar';
import NoteItem from '../components/Profile/NoteItem';
import ButtonLink from '../components/Profile/ButtonLink';

const defaultPfp = require('../assets/default-pfp.png');

function Profile({ match }) {
    const {
        params: { username },
    } = match;

    const [userData, setUserData] = useState(null);
    const [sortedEditHistoryDates, setSortedEditHistoryDates] = useState([]);

    const getUserData = async () => {
        const { data: userData, status: userStatus } = await axios.post(
            '/v1/user/profile',
            {
                username,
                dayCount: 365,
            }
        );
        if (userStatus === 200) {
            setUserData(userData);
        }
    };

    useEffect(() => {
        getUserData();
    }, [username]);

    const [user, setUser] = useState();
    const getUser = async () => {
        const { data, status } = await axios.get('/v1/curuser');
        if (status === 200) {
            setUser(data);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (userData && userData.history) {
            const newSortedEditHistoryDates = Object.keys(userData.history);
            setSortedEditHistoryDates(
                newSortedEditHistoryDates.slice(0).sort()
            );
        }
    }, [userData]);

    let sortedFileList;
    if (userData && userData.file_list) {
        sortedFileList = userData.file_list;
        sortedFileList.sort((a, b) => {
            return new Date(b.lastModified) - new Date(a.lastModified);
        });
    }

    let followingUser = false;
    if (user && userData && userData.profile && userData.profile.followerList) {
        for (const follower of userData.profile.followerList) {
            if (follower.id === user.id) {
                followingUser = true;
            }
        }
    }

    const followUser = async () => {
        await axios.post('/v1/user/follow', {
            username
        })
        getUserData();
    };

    const unfollowUser = async () => {
        await axios.post('/v1/user/unfollow', {
            username
        })
        getUserData();
    };

    return (
        <div>
            <Navbar user={user} />
            {userData && (
                <Content>
                    {userData.profile && (
                        <div style={styles.userInfoContainer}>
                            <UserAvatar src={defaultPfp} />
                            <Name>{userData.profile.name}</Name>
                            <Details>
                                <DetailRow className="mono">
                                    <PeopleIcon style={styles.icon} />
                                    <div>
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                marginRight: 5,
                                            }}
                                        >
                                            {
                                                userData.profile.followerList
                                                    .length
                                            }
                                        </span>
                                        followers
                                    </div>
                                    <div
                                        style={{
                                            marginLeft: 8,
                                            marginRight: 8,
                                        }}
                                    >
                                        ·
                                    </div>
                                    <div>
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                marginRight: 5,
                                            }}
                                        >
                                            {
                                                userData.profile.followingList
                                                    .length
                                            }
                                        </span>
                                        following
                                    </div>
                                </DetailRow>
                                <DetailRow className="mono">
                                    <MortarBoardIcon style={styles.icon} />
                                    School not set
                                </DetailRow>
                                <DetailRow className="mono">
                                    <LocationIcon style={styles.icon} />
                                    Location not set
                                </DetailRow>
                                <div
                                    style={{
                                        marginTop: 5,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ButtonLink
                                        style={{
                                            padding: 3,
                                        }}
                                        onClick={() => {
                                            if (followingUser) {
                                                unfollowUser();
                                            } else {
                                                followUser();
                                            }
                                        }}
                                    >
                                        {followingUser ? 'Unfollow' : 'Follow'}
                                    </ButtonLink>
                                </div>
                            </Details>
                        </div>
                    )}
                    <Title>activity</Title>
                    {userData.history && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                        >
                            {sortedEditHistoryDates.map((date) => {
                                return (
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            margin: 1.5,
                                            borderRadius: 1,
                                            backgroundColor:
                                                userData.history[date] > 0
                                                    ? 'green'
                                                    : '#EAEDF0',
                                        }}
                                        key={date}
                                    />
                                );
                            })}
                        </div>
                    )}

                    <Title style={{ marginTop: 40 }}>notes</Title>
                    {sortedFileList && sortedFileList.length > 0 ? (
                        <div>
                            {sortedFileList.map((note) => (
                                <NoteItem
                                    className="mono"
                                    onClick={() => console.log(note.name)}
                                    noteData={note}
                                />
                            ))}
                        </div>
                    ) : (
                        <InfoMessage className="mono">
                            There's nothing here right now :(
                        </InfoMessage>
                    )}
                </Content>
            )}
        </div>
    );
}

const styles = {
    userInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
};

export default Profile;
