import { useMemo } from "react";
import { useSelector } from "react-redux";

import { selectUserInfo } from "store/user/selectors";

import TextField from "components/TextField";
import Combobox from "components/ComboBox";
import Scrollbar from "components/Scrollbar";

import { ReactComponent as UserProfile } from "assets/img/user.svg";
import "./styles.scss";

const Profile: React.FC = () => {
	const user = useSelector(selectUserInfo);

	const userSteps = useMemo(() => {
		return user.steps.map((step) => ({ text: step.name, id: step.id }));
	}, [user.steps]);

	return (
		<div className='profile-page main-bg-color'>
			<Scrollbar>
				<div className='py-6 px-10 row justify-center'>
					<div className='col-6'>
						<h2 className='profile-page-title text-h4 font-weight-semibold text-center'>
							İstifadəçi məlumatları
						</h2>
					</div>
				</div>

				<div className='pa-10'>
					<div className='row justify-center'>
						<div className='col-9'>
							<div className='card d-flex flex-column align-center px-10 py-6'>
								<div className='profile-page-img-wrapper'>
									{user.image ? (
										<img
											src={`data:image/png;base64,${user.image}`}
											alt='Profile'
											className='profile-page-img'
										/>
									) : (
										<UserProfile />
									)}
								</div>

								<div className='row'>
									<div className='col-4 mb-10 px-2'>
										<TextField name='name' value={user.name} type='text' readonly label='Ad' />
									</div>

									<div className='col-4 mb-10 px-2'>
										<TextField
											name='surname'
											value={user.surname}
											type='text'
											readonly
											label='Soyad'
										/>
									</div>

									<div className='col-4 mb-10 px-2'>
										<TextField
											name='father'
											value={user.father}
											type='text'
											readonly
											label='Ata adı'
										/>
									</div>

									<div className='col-3 mb-10 px-2'>
										<TextField
											name='birthDate'
											value={user.birthDate}
											type='text'
											readonly
											label='Doğum tarixi'
										/>
									</div>

									<div className='col-3 mb-10 px-2'>
										<TextField
											name='gender'
											value={user.gender}
											type='text'
											readonly
											label='Cinsi'
										/>
									</div>

									<div className='col-3 mb-10 px-2'>
										<TextField name='pin' value={user.pin} type='text' readonly label='FİN' />
									</div>

									<div className='col-3 mb-10 px-2'>
										<TextField
											name='role'
											value={user.role.name}
											type='text'
											readonly
											label='İstaifadəçinin rolu'
										/>
									</div>

									<div className='col-12 mb-10 px-2'>
										<TextField
											name='address'
											value={user.address || " "}
											type='text'
											readonly
											label='Qeydiyyat ünvanı'
										/>
									</div>

									<div className='col-12 mb-10 px-2'>
										<Combobox
											options={[]}
											name='steps'
											values={userSteps}
											readonly
											label='Qurum üzrə vəzifəsi'
											multiple
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Scrollbar>
		</div>
	);
};

export default Profile;
