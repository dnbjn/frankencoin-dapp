import AppCard from "@components/AppCard";
import TokenInputChain from "@components/Input/TokenInputChain";
import { ADDRESS, ChainId, ChainIdMain, ChainIdSide, FrankencoinABI, SavingsABI } from "@frankencoin/zchf";
import { useConnection, useBlockNumber, useChainId } from "wagmi";
import { Address, isAddress, zeroAddress } from "viem";
import { useEffect, useState } from "react";
import SavingsDetailsCard from "./SavingsDetailsCard";
import { readContract } from "wagmi/actions";
import { WAGMI_CHAINS, WAGMI_CONFIG, SAVINGS_DEFAULT_REFERRAL_FEE_PPM, SAVINGS_DEFAULT_REFERRER } from "../../app.config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/redux.store";
import SavingsActionInterest from "./SavingsActionInterest";
import SavingsActionSave from "./SavingsActionSave";
import SavingsActionWithdraw from "./SavingsActionWithdraw";
import AppToggle from "@components/AppToggle";
import AddressInput from "@components/Input/AddressInput";
import SavingsActionSaveOnBehalf from "./SavingsActionSaveOnBehalf";
import { ContractUrl, getChain, normalizeAddress, shortenAddress } from "@utils";
import { useRouter } from "next/router";
import AppLink from "@components/AppLink";
import { AppKitNetwork } from "@reown/appkit/networks";
import { useAppKitNetwork } from "@reown/appkit/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";

export default function SavingsInteractionCard() {
	const { status } = useSelector((state: RootState) => state.savings.savingsInfo);
	const chainId = useChainId() as ChainId;
	const chain = getChain(chainId);
	const AppKitNetwork = useAppKitNetwork();

	const [amount, setAmount] = useState(0n);
	const [error, setError] = useState("");
	const [isLoaded, setLoaded] = useState<boolean>(false);

	const [userBalance, setUserBalance] = useState(0n);
	const [userSavingsBalance, setUserSavingsBalance] = useState(0n);
	const [userSavingsTicks, setUserSavingsTicks] = useState(0n);
	const [userSavingsInterest, setUserSavingsInterest] = useState(0n);
	const [userSavingsLocktime, setUserSavingsLocktime] = useState(0n);
	const [userSavingsReferrer, setUserSavingsReferrer] = useState<Address>(zeroAddress);
	const [userSavingsReferralFeePPM, setUserSavingsReferralFeePPM] = useState(0n);
	const [userSavingsReferralFees, setUserSavingsReferralFees] = useState(0n);
	const [newReferrer, setNewReferrer] = useState<Address | undefined>(undefined);
	const [newReferralFeePPM, setNewReferralFeePPM] = useState(0n);
	const [referrerDismissed, setReferrerDismissed] = useState(false);
	const [isRemovingReferrer, setIsRemovingReferrer] = useState(false);
	const [currentTicks, setCurrentTicks] = useState(0n);
	const [onbehalfToggle, setOnbehalfToggle] = useState(false);
	const [onbehalfAddress, setOnbehalfAddress] = useState("");
	const [onbehalfError, setOnbehalfError] = useState("");

	const frankencoinAddress =
		chainId == 1 ? ADDRESS[chainId as ChainIdMain].frankencoin : ADDRESS[chainId as ChainIdSide].ccipBridgedFrankencoin;
	const savingsAdresse = normalizeAddress(
		chainId == 1 ? ADDRESS[chainId as ChainIdMain].savingsReferral : ADDRESS[chainId as ChainIdSide].ccipBridgedSavings
	);

	const state = status[chainId][savingsAdresse];

	const { data } = useBlockNumber({ watch: true });
	const { address } = useConnection();
	const router = useRouter();

	const queryAddress: Address = normalizeAddress(String(router.query.address));
	const account = isAddress(queryAddress) ? queryAddress : address ?? zeroAddress;

	const fromSymbol = "ZCHF";
	const change: bigint = amount - (userSavingsBalance + userSavingsInterest);
	const direction: boolean = amount >= userSavingsBalance + userSavingsInterest;
	const claimable: boolean = userSavingsInterest > 0n;

	// ---------------------------------------------------------------------------

	useEffect(() => {
		if (referrerDismissed) return;
		if (isAddress(SAVINGS_DEFAULT_REFERRER) && SAVINGS_DEFAULT_REFERRER !== zeroAddress) {
			setNewReferrer(SAVINGS_DEFAULT_REFERRER);
			setNewReferralFeePPM(SAVINGS_DEFAULT_REFERRAL_FEE_PPM);
		}
	}, [referrerDismissed]);

	const onRemoveReferrer = () => {
		setIsRemovingReferrer(true);
		setTimeout(() => {
			setReferrerDismissed(true);
			setNewReferrer(undefined);
			setNewReferralFeePPM(0n);
			setIsRemovingReferrer(false);
		}, 200);
	};

	useEffect(() => {
		if (!isAddress(account)) return;

		const fetchAsync = async function () {
			const _balance = await readContract(WAGMI_CONFIG, {
				address: frankencoinAddress,
				chainId: chainId,
				abi: FrankencoinABI,
				functionName: "balanceOf",
				args: [account],
			});
			setUserBalance(_balance);

			const [_userSavings, _userTicks] = await readContract(WAGMI_CONFIG, {
				address: savingsAdresse,
				chainId: chainId,
				abi: SavingsABI,
				functionName: "savings",
				args: [account],
			});
			setUserSavingsBalance(_userSavings);
			setUserSavingsTicks(_userTicks);

			const _current = await readContract(WAGMI_CONFIG, {
				address: savingsAdresse,
				chainId: chainId,
				abi: SavingsABI,
				functionName: "currentTicks",
			});
			setCurrentTicks(_current);

			const _locktime = _userTicks >= _current ? (_userTicks - _current) / BigInt(state.rate) : 0n;
			setUserSavingsLocktime(_locktime);

			const _tickDiff = _current - _userTicks;
			const _interest = _userTicks == 0n || _locktime > 0 ? 0n : (_tickDiff * _userSavings) / (1_000_000n * 365n * 24n * 60n * 60n);

			setUserSavingsInterest(_interest);

			const [, , _referrer, _referralFeePPM] = await readContract(WAGMI_CONFIG, {
				address: savingsAdresse,
				chainId,
				abi: SavingsABI,
				functionName: "savings",
				args: [account],
			});

			setUserSavingsReferrer(_referrer);
			setUserSavingsReferralFeePPM(BigInt(_referralFeePPM));

			const _fee = (_interest * BigInt(_referralFeePPM)) / 1_000_000n;
			setUserSavingsReferralFees(_fee);

			if (!isLoaded) {
				setAmount(_userSavings);
				setLoaded(true);
			}
		};

		fetchAsync();
	}, [data, account, isLoaded, frankencoinAddress, savingsAdresse, state, chainId]);

	useEffect(() => {
		setLoaded(false);
	}, [account]);

	useEffect(() => {
		if (isAddress(onbehalfAddress) || onbehalfAddress == "") {
			setOnbehalfError("");
		} else {
			setOnbehalfError("Address is not valid.");
		}
	}, [onbehalfAddress]);

	useEffect(() => {
		if (amount > userBalance + (!onbehalfToggle ? userSavingsBalance + userSavingsInterest : 0n)) {
			setError(`Not enough ${fromSymbol} in your wallet.`);
		} else {
			setError("");
		}
	}, [amount, onbehalfToggle, userBalance, userSavingsBalance, userSavingsInterest]);

	// ---------------------------------------------------------------------------

	const onChangeChain = (value: string) => {
		const chain = WAGMI_CHAINS.find((c) => c.name == value) as AppKitNetwork;
		if (chain != undefined) AppKitNetwork.switchNetwork(chain);
	};

	const onChangeAmount = (value: string) => {
		const valueBigInt = BigInt(value);
		setAmount(valueBigInt);
	};

	return (
		<section className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
			<AppCard>
				<div className="text-lg font-bold text-center">{!onbehalfToggle ? "Adjustment" : "Save on behalf"}</div>

				<div className="mt-8">
					<TokenInputChain
						label={!onbehalfToggle ? "Your savings" : "You save"}
						chain={chain.name}
						min={!onbehalfToggle ? BigInt("0") : undefined}
						max={!onbehalfToggle ? userBalance + userSavingsBalance + userSavingsInterest : userBalance}
						reset={!onbehalfToggle ? userSavingsBalance : 0n}
						symbol={fromSymbol}
						placeholder={fromSymbol + " Amount"}
						value={amount.toString()}
						onChange={onChangeAmount}
						error={error}
						limit={userBalance}
						limitDigit={18}
						limitLabel="Balance"
						onChangeChain={onChangeChain}
						tokenLogo={"ZCHF"}
					/>
				</div>

				<div className="">
					{onbehalfToggle ? (
						<AddressInput
							label="To address"
							placeholder="0x1a2b3c..."
							error={onbehalfError}
							value={onbehalfAddress}
							onChange={setOnbehalfAddress}
						/>
					) : null}
					<AppToggle disabled={false} label="Custom target address" enabled={onbehalfToggle} onChange={setOnbehalfToggle} />
				</div>

				<div className="mx-auto my-4 w-full flex-col flex gap-4">
					{onbehalfToggle ? (
						<SavingsActionSaveOnBehalf
							disabled={onbehalfError != "" || onbehalfAddress == ""}
							savingsModule={savingsAdresse}
							amount={amount}
							onBehalf={onbehalfAddress as Address}
						/>
					) : userSavingsInterest > 0 && amount == userSavingsBalance ? (
						<SavingsActionInterest
							disabled={!!error}
							savingsModule={savingsAdresse}
							balance={userSavingsBalance}
							interest={userSavingsInterest}
							newReferrer={newReferrer}
							newReferralFeePPM={newReferralFeePPM}
						/>
					) : amount > userSavingsBalance ? (
						<SavingsActionSave
							disabled={!!error}
							savingsModule={savingsAdresse}
							amount={amount}
							interest={userSavingsInterest}
							newReferrer={newReferrer}
							newReferralFeePPM={newReferralFeePPM}
						/>
					) : (
						<SavingsActionWithdraw
							disabled={userSavingsBalance == 0n || !!error}
							savingsModule={savingsAdresse}
							balance={amount}
							change={change}
							newReferrer={newReferrer}
							newReferralFeePPM={newReferralFeePPM}
						/>
					)}
				</div>

				{newReferrer ? (
					<div
						className={`relative mt-8 p-4 pr-10 rounded-2xl bg-status-success/5 border border-status-success/20 transition-all duration-200 ${
							isRemovingReferrer ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
						}`}
					>
						<button
							type="button"
							onClick={onRemoveReferrer}
							aria-label="Remove referrer"
							title="Remove referrer"
							className="absolute top-2 right-2 w-7 h-7 inline-flex items-center justify-center rounded-full text-text-secondary hover:bg-card-input-border hover:text-text-primary transition-colors"
						>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
								<path d="M2 2 L12 12 M12 2 L2 12" />
							</svg>
						</button>

						<div className="flex items-start gap-3">
							<div className="flex-shrink-0 w-9 h-9 rounded-full bg-status-success/15 inline-flex items-center justify-center">
								<FontAwesomeIcon icon={faHandHoldingHeart} className="w-4 h-4 text-status-success" />
							</div>
							<div className="flex-1">
								<div className="font-semibold text-text-primary">Support the host</div>
								<div className="text-sm text-text-secondary mt-1">
									This app is run by a community member. Your deposit stays 100% yours — only a slice of the interest you earn supports him. Pick what feels fair. Goes to{" "}
									<AppLink
										label={shortenAddress(newReferrer)}
										href={ContractUrl(newReferrer, chain)}
										external={true}
									/>
									.
								</div>
							</div>
						</div>

						<div className="mt-5">
							<div className="grid grid-cols-5 gap-2">
								{[5, 10, 15, 20, 25].map((pct) => {
									const ppm = BigInt(pct * 10_000);
									const selected = newReferralFeePPM === ppm;
									const isDefault = pct === 10;
									return (
										<button
											key={pct}
											type="button"
											onClick={() => setNewReferralFeePPM(ppm)}
											title={isDefault ? "Recommended default" : undefined}
											className={`flex items-center justify-center gap-1 px-2 py-2 rounded-xl border transition-all ${
												selected
													? "bg-button-default border-button-default text-white ring-2 ring-button-default/30"
													: "bg-card-body-primary border-card-input-border text-text-primary hover:border-button-default hover:text-button-default"
											}`}
										>
											<span className="text-base font-semibold leading-none">{pct}%</span>
											{isDefault ? (
												<span
													aria-label="Recommended"
													className={`text-xs leading-none ${selected ? "text-white/90" : "text-status-success"}`}
												>
													★
												</span>
											) : null}
										</button>
									);
								})}
							</div>
							<div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary">
								<span className="text-status-success">★</span>
								<span>Recommended default. You can change or remove this anytime.</span>
							</div>
						</div>
					</div>
				) : null}
			</AppCard>

			<SavingsDetailsCard
				account={account}
				chain={chain}
				balance={userSavingsBalance}
				change={isLoaded && !onbehalfToggle ? change : 0n}
				direction={direction}
				interest={isLoaded && !onbehalfToggle ? userSavingsInterest : 0n}
				locktime={userSavingsLocktime}
				referrer={userSavingsReferrer}
				referralFeePPM={userSavingsReferralFeePPM}
				referralFees={userSavingsReferralFees}
			/>
		</section>
	);
}
